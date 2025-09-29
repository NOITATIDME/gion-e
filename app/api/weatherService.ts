import * as Location from "expo-location";
import Constants from "expo-constants";

const { weatherApiUrl, weatherApiKey } = Constants.expoConfig?.extra || {};
const WEATHER_API_KEY = weatherApiKey;
const WEATHER_API_URL = weatherApiUrl;

// =============================
// 위경도 → 기상청 격자 좌표 변환
// =============================
function convertToGrid(lat: number, lon: number) {
    const RE = 6371.00877;
    const GRID = 5.0;
    const SLAT1 = 30.0;
    const SLAT2 = 60.0;
    const OLON = 126.0;
    const OLAT = 38.0;
    const XO = 43;
    const YO = 136;
    const DEGRAD = Math.PI / 180.0;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn =
        Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
        Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);

    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx, ny };
}

// =============================
// 일출/일몰 계산
// =============================
function getSunTimes(lat: number, lon: number, date: Date) {
    // 참고: NOAA 공식
    const rad = Math.PI / 180;
    const J1970 = 2440588;
    const J2000 = 2451545;
    const msPerDay = 1000 * 60 * 60 * 24;

    function toJulian(date: Date) {
        return date.getTime() / msPerDay - 0.5 + J1970;
    }

    function fromJulian(j: number) {
        return new Date((j + 0.5 - J1970) * msPerDay);
    }

    function toDays(date: Date) {
        return toJulian(date) - J2000;
    }

    const d = toDays(date);
    const e = rad * 23.4397;  
    const lw = rad * -lon;

    const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
    const Jnoon = J2000 + n + 0.0009 + lw / (2 * Math.PI);

    function solarMeanAnomaly(d: number) {
        return rad * (357.5291 + 0.98560028 * d);
    }

    function eclipticLongitude(M: number) {
        const C =
            rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
        const P = rad * 102.9372;
        return M + C + P + Math.PI;
    }

    function declination(L: number) {
        return Math.asin(Math.sin(L) * Math.sin(e));
    }

    function hourAngle(h: number, phi: number, d: number) {
        return Math.acos(
            (Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d))
        );
    }

    const M = solarMeanAnomaly(d);
    const L = eclipticLongitude(M);
    const dec = declination(L);

    const phi = rad * lat;
    const Jtransit = Jnoon + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);

    const h0 = rad * -0.83; // Sun altitude for sunrise/sunset
    const H = hourAngle(h0, phi, dec);

    const Jrise = Jtransit - H / (2 * Math.PI);
    const Jset = Jtransit + H / (2 * Math.PI);

    return {
        sunrise: fromJulian(Jrise),
        sunset: fromJulian(Jset),
    };
}

// =============================
// 라벨 포맷 함수 (지금, 내일, 모레 포함)
// =============================
const formatLabel = (date: string, hour: number) => {
    const now = new Date();

    const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        "0"
    )}${String(now.getDate()).padStart(2, "0")}`;

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}${String(
        tomorrow.getMonth() + 1
    ).padStart(2, "0")}${String(tomorrow.getDate()).padStart(2, "0")}`;

    const afterTomorrow = new Date(now);
    afterTomorrow.setDate(now.getDate() + 2);
    const afterTomorrowStr = `${afterTomorrow.getFullYear()}${String(
        afterTomorrow.getMonth() + 1
    ).padStart(2, "0")}${String(afterTomorrow.getDate()).padStart(2, "0")}`;

    const forecastDate = new Date(
        parseInt(date.slice(0, 4)),
        parseInt(date.slice(4, 6)) - 1,
        parseInt(date.slice(6, 8)),
        hour
    );

    //오늘
    if (date === todayStr) {
        if (hour === now.getHours()) return "지금";
        if (hour < 12) return `오전 ${hour}`;
        if (hour === 12) return "정오";
        return `오후 ${hour - 12}`;
    }

    // 내일
    if (date === tomorrowStr) {
        if (hour === 0) return "내일";
        if (hour < 12) return `오전 ${hour}`;
        if (hour === 12) return "정오";
        return `오후 ${hour - 12}`;
    }

    // 모레
    if (date === afterTomorrowStr) {
        if (hour === 0) return "모레";
        if (hour < 12) return `오전 ${hour}`;
        if (hour === 12) return "정오";
        return `오후 ${hour - 12}`;
    }

    // 그 이후
    const month = forecastDate.getMonth() + 1;
    const day = forecastDate.getDate();

    if (hour < 12) return `${month}/${day} 오전 ${hour}`;
    if (hour === 12) return `${month}/${day} 정오`;
    return `${month}/${day} 오후 ${hour - 12}`;
};

// =============================
// 기상청 단기예보 데이터 가져오기
// =============================
export async function fetchWeatherData() {
    // 강남 좌표 (fallback)
    let latitude = 37.5172;
    let longitude = 127.0473;

    try {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            latitude = loc.coords.latitude;
            longitude = loc.coords.longitude;
        } else {
            console.log("위치 권한 거부됨 → 강남 좌표 사용");
        }
    } catch (e) {
        console.log("위치 권한 요청 에러 → 강남 좌표 사용", e);
    }

    const { nx, ny } = convertToGrid(latitude, longitude);

    const now = new Date();
    const sunTimes = getSunTimes(latitude, longitude, now);

    const baseDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        "0"
    )}${String(now.getDate()).padStart(2, "0")}`;

    let baseTime = "0200";
    const hour = now.getHours();

    if (hour >= 2 && hour < 5) baseTime = "0200";
    else if (hour >= 5 && hour < 8) baseTime = "0500";
    else if (hour >= 8 && hour < 11) baseTime = "0800";
    else if (hour >= 11 && hour < 14) baseTime = "1100";
    else if (hour >= 14 && hour < 17) baseTime = "1400";
    else if (hour >= 17 && hour < 20) baseTime = "1700";
    else if (hour >= 20 && hour < 23) baseTime = "2000";
    else baseTime = "2300";

    const url = `${WEATHER_API_URL}?serviceKey=${WEATHER_API_KEY}&numOfRows=2000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    const res = await fetch(url);
    const json = await res.json();

    if (!json.response || !json.response.body) {
        throw new Error("기상청 API 응답이 올바르지 않습니다.");
    }
    if (json.response.header.resultCode !== "00") {
        throw new Error(json.response.header.resultMsg || "API 요청 실패");
    }

    const items = json.response.body.items.item;

    const forecastMap: Record<string, any> = {};
    const dailyMap: Record<string, { low: number; high: number; condition: string }> = {};

    items.forEach((item: any) => {
        const { fcstDate, fcstTime, category, fcstValue } = item;
        const hour = parseInt(fcstTime.slice(0, 2));
        const key = `${fcstDate}_${hour}`;

        if (!forecastMap[key]) {
            forecastMap[key] = {
                date: fcstDate,
                hour,
                temp: null,
                condition: "맑음-주",
            };
        }

        // 기온
        if (category === "TMP") {
            const temp = parseInt(fcstValue);
            forecastMap[key].temp = temp;

            if (!dailyMap[fcstDate]) {
                dailyMap[fcstDate] = { low: temp, high: temp, condition: "맑음-주" };
            } else {
                dailyMap[fcstDate].low = Math.min(dailyMap[fcstDate].low, temp);
                dailyMap[fcstDate].high = Math.max(dailyMap[fcstDate].high, temp);
            }
        }

        // 강수 형태 (PTY)
        if (category === "PTY") {
            if (fcstValue === "1" || fcstValue === "5") {
                forecastMap[key].condition = "비";
            } else if (["2", "3", "6", "7"].includes(fcstValue)) {
                forecastMap[key].condition = "눈";
            }
        }

        // 하늘 상태 (SKY) → 강수 없을 때만 반영
        if (category === "SKY" && (forecastMap[key].condition === "맑음(주)" || forecastMap[key].condition.startsWith("맑음") || forecastMap[key].condition.startsWith("부분적 흐림"))) {
            const dateObj = new Date(
                parseInt(fcstDate.slice(0, 4)),
                parseInt(fcstDate.slice(4, 6)) - 1,
                parseInt(fcstDate.slice(6, 8)),
                hour
            );

            const isDaytime = dateObj >= sunTimes.sunrise && dateObj < sunTimes.sunset;

            if (fcstValue === "1") {
                forecastMap[key].condition = isDaytime ? "맑음(주)" : "맑음(야)";
            } else if (fcstValue === "3") {
                forecastMap[key].condition = isDaytime ? "부분적 흐림(주)" : "부분적 흐림(야)";
            } else if (fcstValue === "4") {
                forecastMap[key].condition = "흐림";
            }
        }
    });

    const sorted = Object.values(forecastMap).sort(
        (a: any, b: any) =>
            new Date(`${a.date} ${a.hour}:00`).getTime() -
            new Date(`${b.date} ${b.hour}:00`).getTime()
    );

    // ====== 3시간 단위 예보 ======
    const hourly = [];

    for (let f of sorted) {
        const t = new Date(
            parseInt(f.date.slice(0, 4)),
            parseInt(f.date.slice(4, 6)) - 1,
            parseInt(f.date.slice(6, 8)),
            f.hour
        );

        if ((t >= now && f.hour % 3 === 0) || (f.date === baseDate && f.hour === hour)) {
            hourly.push({
                label: formatLabel(f.date, f.hour),
                temp: f.temp,
                condition: f.condition,
                hour: f.hour,
                date: f.date,
            });
        }

        if (hourly.length >= 17) break;
    }

    return { hourly, daily: dailyMap };
}

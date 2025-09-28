// services/DailyWeatherService.ts
import * as Location from "expo-location";
import Constants from "expo-constants";

/**
 * DailyWeather: 화면에서 사용할 일별 요약 타입
 */
export type DailyWeather = {
    date: string; // YYYYMMDD
    min: number;
    max: number;
    condition: "sunny" | "cloudy" | "rain" | "snow" | "other";
    minClothes?: string;
    maxClothes?: string;
};

const {
    weatherApiUrl,
    weatherApiKey,
    dailyMidTaApiUrl,
    dailyMidLandFcstApiUrl,
    dailyWeatherApiKey,
} = Constants.expoConfig?.extra || {};

// === 설정 ===
const WEATHER_API_KEY = weatherApiKey;
const WEATHER_API_URL = weatherApiUrl;

const DAILY_WEATHER_API_KEY = dailyWeatherApiKey;
const DAILY_WEATHER_TA_API_URL = dailyMidTaApiUrl;
const DAILY_WEATHER_FCST_API_URL = dailyMidLandFcstApiUrl;

// 수도권/서울 기본 코드
const DEFAULT_REGID_LAND = "11B00000"; // 수도권
const DEFAULT_REGID_TEMP = "11B10101"; // 서울

// 강남 기본 좌표
const GANGNAM_LAT = 37.5172;
const GANGNAM_LON = 127.0473;

// ----------------- 유틸 -----------------
const zero = (n: number) => String(n).padStart(2, "0");

function formatYYYYMMDD(d: Date) {
    return `${d.getFullYear()}${zero(d.getMonth() + 1)}${zero(d.getDate())}`;
}

function addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}

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
        Math.log(Math.cos(slat1) / Math.cos(slat2)) /
        Math.log(
            Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
            Math.tan(Math.PI * 0.25 + slat1 * 0.5)
        );

    let sf =
        (Math.pow(Math.tan(Math.PI * 0.25 + slat1 * 0.5), sn) * Math.cos(slat1)) / sn;

    let ro =
        (re * sf) / Math.pow(Math.tan(Math.PI * 0.25 + olat * 0.5), sn);

    let ra =
        (re * sf) / Math.pow(Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5), sn);

    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    return {
        nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
        ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
    };
}

function getVilageBaseTime(now = new Date()) {
    const baseTimes = [
        "0200",
        "0500",
        "0800",
        "1100",
        "1400",
        "1700",
        "2000",
        "2300",
    ];
    let chosen = baseTimes[0];

    for (let i = 0; i < baseTimes.length; i++) {
        const hour = parseInt(baseTimes[i].slice(0, 2), 10);
        const cutoff = new Date(now);
        cutoff.setHours(hour);
        cutoff.setMinutes(30);
        if (now >= cutoff) chosen = baseTimes[i];
    }

    let baseDate = formatYYYYMMDD(now);
    const firstCutoff = new Date(now);
    firstCutoff.setHours(2);
    firstCutoff.setMinutes(30);

    if (now < firstCutoff) {
        const prev = new Date(now);
        prev.setDate(prev.getDate() - 1);
        baseDate = formatYYYYMMDD(prev);
    }

    return { baseDate, baseTime: chosen };
}

function getMidTmFc(now = new Date()) {
    const yyyy = now.getFullYear();
    const mm = zero(now.getMonth() + 1);
    const dd = zero(now.getDate());
    const hh = now.getHours() < 18 ? "0600" : "1800";
    return `${yyyy}${mm}${dd}${hh}`;
}

function safeNum(x: any) {
    if (x == null) return NaN;
    const n = Number(x);
    return Number.isNaN(n) ? NaN : n;
}

function mapConditionFromText(wf: string) {
    if (!wf) return "other";
    if (wf.includes("맑") || wf.includes("갬")) return "sunny";
    if (wf.includes("흐림") || wf.includes("구름") || wf.includes("구름많음"))
        return "cloudy";
    if (wf.includes("비") || wf.includes("소나기") || wf.includes("강우"))
        return "rain";
    if (wf.includes("눈") || wf.includes("강설")) return "snow";
    return "other";
}

// ----------------- API -----------------
async function fetchShortTermDailyMap(nx: number, ny: number) {
    const { baseDate, baseTime } = getVilageBaseTime();

    const url = `${WEATHER_API_URL}?serviceKey=${WEATHER_API_KEY}&numOfRows=2000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    const res = await fetch(url);
    const json = await res.json();
    const items: any[] = json?.response?.body?.items?.item || [];

    const dailyBuckets: Record<string, any[]> = {};

    items.forEach((it: any) => {
        const fcstDate = it.fcstDate;
        const hour = parseInt(it.fcstTime.slice(0, 2), 10);
        const category = it.category;
        const val = it.fcstValue;

        if (!dailyBuckets[fcstDate]) dailyBuckets[fcstDate] = [];

        let entry = dailyBuckets[fcstDate].find((e) => e.hour === hour);
        if (!entry) {
            entry = { hour, temp: null, pty: undefined, sky: undefined };
            dailyBuckets[fcstDate].push(entry);
        }

        if (category === "TMP") entry.temp = safeNum(val);
        if (category === "PTY") entry.pty = val;
        if (category === "SKY") entry.sky = val;
    });

    const today = new Date();
    const out: Record<string, { min: number; max: number; condition: string }> =
        {};

    // 단기예보: 오늘~D+3까지 (4일간)
    for (let d = 0; d <= 3; d++) {
        const dt = formatYYYYMMDD(addDays(today, d));
        const arr = dailyBuckets[dt] || [];

        const temps = arr.map((a) => a.temp).filter((t) => t != null) as number[];
        const min = temps.length ? Math.min(...temps) : NaN;
        const max = temps.length ? Math.max(...temps) : NaN;

        // condition 집계
        const condCounts: Record<string, number> = {};
        arr.forEach((a) => {
            let c = "other";
            if (a.pty && a.pty !== "0") c = "rain";
            else if (a.sky === "1") c = "sunny";
            else if (a.sky === "3" || a.sky === "4") c = "cloudy";
            condCounts[c] = (condCounts[c] || 0) + 1;
        });

        const rep =
            Object.entries(condCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "other";

        out[dt] = {
            min: Number.isFinite(min) ? Math.round(min) : 0,
            max: Number.isFinite(max) ? Math.round(max) : 0,
            condition: rep as any,
        };
    }

    return out;
}

async function fetchMidTermDailyMap(
    regIdTemp = DEFAULT_REGID_TEMP,
    regIdLand = DEFAULT_REGID_LAND
) {
    const tmFc = getMidTmFc();

    const taUrl = `${DAILY_WEATHER_TA_API_URL}?serviceKey=${DAILY_WEATHER_API_KEY}&numOfRows=10&pageNo=1&regId=${regIdTemp}&tmFc=${tmFc}&dataType=JSON`;
    const landUrl = `${DAILY_WEATHER_FCST_API_URL}?serviceKey=${DAILY_WEATHER_API_KEY}&numOfRows=10&pageNo=1&regId=${regIdLand}&tmFc=${tmFc}&dataType=JSON`;

    const [taRes, landRes] = await Promise.all([fetch(taUrl), fetch(landUrl)]);
    const taJson = await taRes.json();
    const landJson = await landRes.json();

    const taItem = taJson?.response?.body?.items?.item?.[0];
    const landItem = landJson?.response?.body?.items?.item?.[0];

    const result: Record<string, { min: number; max: number; condition: string }> =
        {};

    const today = new Date();

    if (!taItem || !landItem) {
        console.error("중기예보 데이터가 없습니다");
        return result;
    }

    // 중기예보: D+4~D+9까지 (6일간)
    for (let i = 4; i <= 9; i++) {
        const d = formatYYYYMMDD(addDays(today, i));
        const minVal = safeNum(taItem[`taMin${i}`]);
        const maxVal = safeNum(taItem[`taMax${i}`]);

        // wf 키 처리
        let wf = "";
        if (i >= 4 && i <= 7) {
            const am = landItem[`wf${i}Am`] || "";
            const pm = landItem[`wf${i}Pm`] || "";
            wf = am === pm ? am : `${am} / ${pm}`;
        } else {
            wf = landItem[`wf${i}`] || "";
        }

        result[d] = {
            min: Number.isFinite(minVal) ? Math.round(minVal) : 0,
            max: Number.isFinite(maxVal) ? Math.round(maxVal) : 0,
            condition: mapConditionFromText(String(wf)),
        };
    }

    return result;
}

// ----------------- 메인 -----------------
export async function fetchDailyWeatherCombined(
    regIdTemp?: string,
    regIdLand?: string
) {
    try {
        let nx: number, ny: number;

        // 📌 권한 상태 확인
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status === "granted") {
            // 권한 허용 → 현재 위치 사용
            const loc = await Location.getCurrentPositionAsync({});
            const grid = convertToGrid(loc.coords.latitude, loc.coords.longitude);
            nx = grid.nx;
            ny = grid.ny;
        } else {
            // 권한 거부 → 강남 기본 좌표 사용
            console.log("위치 권한 없음 → 강남 기본 좌표 사용");
            const grid = convertToGrid(GANGNAM_LAT, GANGNAM_LON);
            nx = grid.nx;
            ny = grid.ny;

            // 중기예보도 강남(서울/수도권 코드)으로 맞춤
            regIdTemp = DEFAULT_REGID_TEMP;
            regIdLand = DEFAULT_REGID_LAND;
        }

        // 단기예보: D+0~D+3 (4일간)
        const shortMap = await fetchShortTermDailyMap(nx, ny);

        // 중기예보: D+4~D+9 (6일간)
        const midMap = await fetchMidTermDailyMap(
            regIdTemp || DEFAULT_REGID_TEMP,
            regIdLand || DEFAULT_REGID_LAND
        );

        const out: DailyWeather[] = [];
        const today = new Date();

        for (let i = 0; i < 10; i++) {
            const dateKey = formatYYYYMMDD(addDays(today, i));
            const rec = shortMap[dateKey] || midMap[dateKey] || {
                min: 0,
                max: 0,
                condition: "other",
            };

            out.push({
                date: dateKey,
                min: rec.min,
                max: rec.max,
                condition: rec.condition as any,
                minClothes: getClothes(rec.min, "min"),
                maxClothes: getClothes(rec.max, "max"),
            });
        }

        return out;
    } catch (err) {
        console.error("fetchDailyWeatherCombined 오류:", err);
        return [];
    }
}

// 옷차림 추천
function getClothes(temp: number, _type: "min" | "max") {
    if (temp >= 28) return "민소매";
    if (temp >= 23) return "반팔티";
    if (temp >= 20) return "가디건";
    if (temp >= 17) return "얇은 자켓";
    if (temp >= 12) return "맨투맨";
    if (temp >= 9) return "자켓";
    if (temp >= 5) return "코트";
    return "패딩";
}

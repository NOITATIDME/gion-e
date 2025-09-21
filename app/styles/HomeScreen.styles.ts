import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const WHITE = '#ffffff';
const PANEL_BG = 'rgba(0, 61, 116, 0.40)';
const CARD_ACTIVE_BG = '#39A0FF';
const CARD_INACTIVE_BG = '#FFFFFF';
const TEXT_DARK = '#000205ff';
const GRAY = 'rgba(255, 255, 255, 0.70)';

const normalizeFont = (size: number) => {
    const scaleFactor = Math.min(width / 375, height / 812);
    const newSize = size * scaleFactor;
    if (width < 350) return Math.max(newSize, size * 0.85);
    if (isTablet) return Math.min(newSize, size * 1.1);
    return newSize;
};

const normalizeSize = (size: number) => {
    const scaleFactor = Math.min(width / 375, height / 812);
    if (width < 350) return size * 0.8;
    if (isTablet) return size * 1.1;
    return size * scaleFactor;
};

export const homeStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#000' },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden', // ✅ 스크롤 방지
    },

    bgWrapper: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    backgroundVideo: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },

    topHero: {
        width: '100%',
        paddingHorizontal: scale(20),
        paddingTop: isTablet ? verticalScale(50) : verticalScale(40),
        position: 'absolute',
        top: 0,
        zIndex: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    locationWrapper: { flexDirection: 'row', alignItems: 'center' },
    locationText: { fontSize: normalizeFont(16), fontWeight: '500', color: GRAY },
    locationArrow: { marginLeft: scale(6), fontSize: normalizeFont(18), fontWeight: '200', color: WHITE },
    headerIcon: { padding: moderateScale(8) },

    tempArea: { alignItems: 'flex-end', marginTop: verticalScale(8) },
    tempRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    nowTemp: { fontSize: normalizeFont(38), color: WHITE, fontWeight: '400' },
    hilo: { fontSize: normalizeFont(18) },
    low: { color: '#39A0FF', fontWeight: '600' },
    high: { color: '#FF5630', fontWeight: '600' },

    tipBubble: {
        position: 'absolute',
        top: height * 0.28, // ✅ marginTop 대신 절대 위치
        alignSelf: 'center',
        backgroundColor: '#1E5079',
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(12),
        zIndex: 2,
    },
    tipText: { color: WHITE, fontSize: normalizeFont(12), lineHeight: normalizeFont(18) },

    actionRow: {
        position: 'absolute',
        right: scale(20),
        bottom: isTablet ? height * 0.30 : height * 0.25,
        flexDirection: 'column',
        alignItems: 'center',
        gap: verticalScale(5),
        zIndex: 2,
    },

    bottomPanel: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: isTablet ? verticalScale(140) : verticalScale(120),
        paddingVertical: verticalScale(14),
        paddingLeft: scale(8),
        backgroundColor: PANEL_BG,
        zIndex: 2,
    },
    hourlyList: { paddingRight: scale(8), flexGrow: 0 }, // ✅ 세로 스크롤 방지
    hourCard: {
        width: normalizeSize(53),
        height: normalizeSize(107),
        borderRadius: moderateScale(10),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(8),
        marginRight: scale(15),
        alignItems: 'center',
    },
    hourCardInactive: { backgroundColor: CARD_INACTIVE_BG },
    hourCardActive: { backgroundColor: CARD_ACTIVE_BG, borderWidth: 1, borderColor: WHITE },
    hourLabel: { fontSize: normalizeFont(10), marginBottom: verticalScale(12) },
    hourLabelInactive: { color: TEXT_DARK, fontWeight: '500' },
    hourLabelActive: { color: WHITE, fontWeight: '500' },
    hourTemp: { fontWeight: '500', paddingTop: '45%' },
    hourTempInactive: { color: TEXT_DARK, fontSize: normalizeFont(10) },
    hourTempActive: { color: WHITE, fontSize: normalizeFont(10) },

    characterWrapper: {
        position: 'absolute',
        bottom: height * 0.001,
        alignSelf: 'center',
        zIndex: 2,
    },
    character: {
        width: normalizeSize(300),
        height: normalizeSize(600),
        resizeMode: 'contain',
    },
});

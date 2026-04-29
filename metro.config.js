const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. 기본 설정 가져오기
const config = getDefaultConfig(__dirname);

// 2. SVG 설정을 위해 resolver와 transformer 추출
const { transformer, resolver } = config;

// 3. 설정을 병합하는 객체 정의
const mergedConfig = {
  ...config,
  transformer: {
    ...transformer,
    // SVG 변환기 지정
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    ...resolver,
    // SVG를 asset에서 제외하고 source로 처리
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  },
};

// 4. NativeWind로 감싸서 최종 내보내기
module.exports = withNativeWind(mergedConfig, { input: "./global.css" });

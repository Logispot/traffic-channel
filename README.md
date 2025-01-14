# traffic-channel

## 개요
이 JavaScript 파일은 사용자가 처음으로 웹사이트를 방문했을 때의 트래픽 채널을 감지하고 저장하는 기능을 제공합니다. 첫 방문 트래픽 채널은 UTM 파라미터나 document.referrer 정보를 기반으로 확인되며, 이후 분석 및 사용자 행동 추적에 활용할 수 있도록 저장됩니다.

## 작동 방식
1. 트래픽 소스 감지

    현재 세션에서 트래픽 소스를 확인:
    - UTM 파라미터 (utm_source, utm_medium, utm_campaign 등)를 먼저 확인.
    - UTM 파라미터가 없는 경우 document.referrer 값을 사용.
2. 기존 데이터 확인

    "첫 방문" 트래픽 소스가 이미 저장되어 있는지 확인 (쿠키에서 확인).
3. 첫 방문 트래픽 소스 저장

    기존 데이터가 없는 경우, 현재 트래픽 소스를 첫 방문 소스로 저장.

## 설치 방법
1. JavaScript 파일을 웹사이트에 포함:
```
<script src="https://cdn.jsdelivr.net/gh/Logispot/traffic-channel@main/traffic-channel.min.js"></script>
```
2. 추적이 필요한 모든 페이지에서 스크립트를 실행.
```
saveTrafficDetailsToCookie();
```

## 옵션
실행함수에 커스터마이징 가능한 설정 옵션을 제공합니다. 예:
```
saveTrafficDetailsToCookie({
  cookieExpirationDays: 14,
});
```

## Minify with Terser
1. Install Terser:
```
npm install terser -g
```
2. Minify a File:
```
terser traffic-channel.js -o traffic-channel.min.js
```
3. Minify with Additional Options:
```
terser traffic-channel.js -o traffic-channel.min.js --compress --mangle
```
- --compress: Compresses the file by removing unused code.
- --mangle: Shortens variable and function names.
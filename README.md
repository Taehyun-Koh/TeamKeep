
# TeamKeep

팀원들과 자료공유가 가능한 데스크톱 앱입니다.

데이터베이스 정보를 입력하는 기능을 만들어 소규모 단위로 DB를 관리할 수 있도록 했습니다.

<p float="left">
    <img src="https://user-images.githubusercontent.com/89441117/205227505-2788b328-9baf-4d30-88b2-580f3da5df0d.png" alt="스크린샷_20221202_031135" style="width:300px"/>
    <img src="https://user-images.githubusercontent.com/89441117/205227608-33e13673-586d-4fc1-a3e6-f8288199d435.png" alt="스크린샷_20221202_031155" style="width:300px"/>
</p>
<p>
    <img src="https://user-images.githubusercontent.com/89441117/205227614-caafedb0-b746-4455-b4bf-919dc0bb6d21.png" alt="스크린샷_20221202_031208" style="width:300px"/>
    <img src="https://user-images.githubusercontent.com/89441117/205227621-3329b7d3-33c7-43b0-83bf-cdff38b4580c.png" alt="스크린샷_20221202_031241" style="width:300px"/>
</p>


## Overview 👋

> 팀원들과 자료공유를 하고 싶을 때
> 
> 개인 자료 저장 공간을 만들고 싶을 때
>
> 나만의 DB를 연결해 TeamKeep 앱을 관리/배포하고 싶을 때
>


## Installation ⚙

**1. repo 받아오기**
```
git clone https://github.com/Taehyun-Koh/TeamKeep.git
```
**2. 디렉토리 이동**
```
cd TeamKeep
```
**3. dependencies 설치**
```
npm i
```
설치파일 생성없이 실행시키고 싶다면 터미널에 다음 커맨드를 입력해주세요. 앱이 실행됩니다.
```
npm start
```
**++ 설치 파일 생성**

(Mac OS)
```
npm run dist:mac
```
(Windows OS)
```
npm run dist:win
```

빌드가 끝난 후, dist 폴더 내 설치 파일 클릭

<img width="579" alt="스크린샷 2022-12-02 17 36 01" src="https://user-images.githubusercontent.com/94899919/205250848-fc27e781-41c7-49ed-a182-ea55a4446a66.png">




## How to use 🤔

> 0. DB를 생성/관리하는 분이라면 다음과 같이 스키마와 테이블 구조 및 이름을 맞춰주세요. 
> 총 3개의 스키마입니다.
>
> <p align="center"><img width="181" alt="스크린샷 2022-12-02 22 06 56" src="https://user-images.githubusercontent.com/94899919/205299684-67861e7f-26af-4d72-9add-c1cea251046b.png"></p>
>
> 
> - my_db : 사진과 같이 Users테이블을 만들어주세요. 사용자의 회원정보가 담기는 스키마입니다.
> - room : 팀별로 파일이 저장되는 스키마입니다.
> - room_info : 팀에 들어와있는 사람과 패스워드를 저장하는 스키마입니다.

1. 사용하고자하는 데이터베이스의 주소, 이름, 비밀번호를 입력해주세요. (최초 1회만 입력해주세요)
2. 회원가입 후 로그인 해주세요.
3. 팀 만들기 또는 비밀번호를 알고 있는 팀에 들어갈 수 있습니다.
 <img width="892" alt="스크린샷 2022-12-02 17 19 13" src="https://user-images.githubusercontent.com/94899919/205247917-096cd40c-13a0-42ab-9167-b49c32e82a33.png">
4. 링크나 이미지를 올리거나, 팀원들이 공유한 자료를 다운로드 받을 수 있어요.
<img width="892" alt="스크린샷 2022-12-02 22 17 51" src="https://user-images.githubusercontent.com/94899919/205301478-f5bca9f9-e93f-4c36-be2e-b09f7cb557b8.png">


4_1. 공유된 파일들을 사진 , 문서, 링크 별로 모아서 볼 수 있습니다.
<img width="892" alt="스크린샷 2022-12-02 22 18 00" src="https://user-images.githubusercontent.com/94899919/205301512-12cb3116-56c7-47ad-b8ad-6faf94688bd5.png">

  
## Contribute Guide 🚩

+ PR을 올려주세요. 코드리뷰 후에 merge&rebase 하도록 합니다.
+ 커밋을 단위별로 올려주세요. [가이드](https://tech.10000lab.xyz/git/git-commit-discipline.html)를 참고해주세요.
+ 이슈 위주로 Task를 관리합니다. 이슈를 활용해 주세요.
  
## MIT License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Code of Conduct
[MIcrosoft's Code Of Conduct](https://opensource.microsoft.com/codeofconduct/)

## Members
김홍인
> 성균관대학교 소프트웨어학과 21학번
> 
>

이건
> 성균관대학교 소프트웨어학과 21학번
> 
>

고태현
> 성균관대학교 소프트웨어학과 19학번
> 



우수 프로젝트 시상 프로그램에 지원합니다.


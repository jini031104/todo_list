# 프로젝트 개요
MongoDB와 REST API를 이용해 [할 밀 메모 사이트]를 구현한다.

## 기능
1. 할 일 추가하기
2. 할 일 목록 보기
3. 할 일 내용 변경하기
4. 할 일 순서 변경하기
5. 할 일 완료하기
6. 할 일 완료 해제하기

### 스키마 정의
|기능|설명|
|----|---|
|해야 할 일(value)|**문자열**(string) 형식의 데이터.할 일의 내용을 나타낸다.|
|해야 할 일의 순서(order)|**숫자**(number) 형식의 데이터. 할 일의 순서를 나타낸다.|
|완료 날짜(doneAt)|**날짜**(Date) 형식의 데이터. 완료되지 않았다면 null, 완료되었다면 날짜 형식의 데이터를 가지게 된다.|

### API 명세서
|기능|Method|URL|요청(Request)|응답(Response)|
|----|------|---|-------------|--------------|
|할 일 등록|POST|/api/todos/|{<br>"value":"제로 콜라 500ml 구매하기"<br>}|{<br>"todo": {<br>"value": "제로 콜라 500ml 구매하기",<br>"order": 1,<br>"_id": "64bd3e6a8f9c069e092ee5c4",<br>"__v": 0,<br>"todoId": "64bd3e6a8f9c069e092ee5c4",<br>"id": "64bd3e6a8f9c069e092ee5c4"<br>}<br>}|
|할 일 목록 조회|GET|/api/todos/|{}|{<br>"todos": [<br>{<br>"_id": "64bd3e6a8f9c069e092ee5c4",<br>"value": "제로 콜라 500ml 구매하기",<br>"order": 1,<br>"__v": 0,<br>"todoId": "64bd3e6a8f9c069e092ee5c4",<br>"id": "64bd3e6a8f9c069e092ee5c4"<br>}<br>]<br>}|
|할 일 순서 변경,<br>내용 변경,<br>완료/해제|PATCH|/api/todos/:todoId|	{<br>"order": 2,<br>"value": "수정된 해야할 일입니다.",<br>"done": false<br>}|{}|
|할 일 삭제|DELETE|/api/todos/:todoId|{}|{}|

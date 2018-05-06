// TODO: interface에 기본값을 줄 수 없나?
// SQL 테이블에 insert할 때 기본값을 주는 것 처럼 NoSQL도 가능한가?
// 그런데 firestore가 기본적으로 schemaless 이지 않나?
interface Card {
    cardID: string;
    question: string;
    answer: string;
    source: string;
    repetition: number;
    stage: number;
    createdDate: Date;
    modifiedDate: Date;
}

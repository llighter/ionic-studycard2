# ionic-studycard

ionic version of studycard system using angularfire2.
You can build this application by installing using Ionic CLI.

Any suggestions, including issue or email, are Welcome.
Feel Free to Express your opinion.

## Studycard System(Leitner)

![image](https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Leitner_system_alternative.svg/440px-Leitner_system_alternative.svg.png)

In the [Leitner system](https://en.wikipedia.org/wiki/Leitner_system), correctly answered cards are advanced to the next, less frequent box, while incorrectly answered cards return to the first box.

## Prerequisite

You Need to implements environments.ts file in environments folder.

```typescript
export const environment = {
    production: false,
    firebase: {
        apiKey: "<API_KEY>",
        authDomain: "<PROJECT_ID>.firebaseapp.com",
        databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
        storageBucket: "<BUCKET>.appspot.com",
        messagingSenderId: "<SENDER_ID>",
    }
}
```

## Install

```bash
npm install
```

## Run

```bash
ionic serve
```
or you can run with
```bash
ionic lab
```

## Preview

![image](https://raw.githubusercontent.com/llighter/ionic-studycard2/master/images/login-add-category.gif)

![image](https://raw.githubusercontent.com/llighter/ionic-studycard2/master/images/add-card.gif)

# 108번뇌 꿰기

바늘 하나로 염주 108알을 꿰는 정적 웹 게임. Getting Over It 식으로, 결국 할 수는 있지만 억울하게 어렵도록 설계했다.

## 난이도 설계 의도

- 실은 위 고리에 묶여 있고 꿴 알은 중력으로 실 위를 미끄러진다. 알 더미의 수위가 바늘귀보다 높아지면(바늘을 깊이 내리면) 줄줄이 빠진다. 체크포인트는 없다.
- 알이 늘수록 실이 길어지고 알이 더 깊은 곳에 나타난다. 대략 화면 60% 깊이까지는 안전하고, 그보다 깊은 알은 빠르게 찍고 올라와야 한다.
- 구멍 허용 오차 감소, 알 회전, 흔들림, 손떨림이 진행도에 비례해 커진다.

## 로컬 실행

```sh
python3 -m http.server 8000
```

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 push 한다.
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `/ (root)`.
3. `index.html` 의 `og:image` 는 SNS 미리보기를 위해 절대 URL(`https://<user>.github.io/<repo>/og.png`)로 바꾸는 것이 좋다.

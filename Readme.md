Инструкция для запуска приложения:
1. Для создания image, в терминале набираем команду: docker build -t citygame(имя image, может быть любое имя) ./Cities_Game(если в терминале вы находитесь в папке /Projects, если же в терминале вы перейдете непосредственно в папку с файлом Dockerfile, то в конце будет просто точка, а не ./Cities_Game);
2. После создания image, набираем в терминале команду: docker images, это позволит увидеть свои image, в том числе и вновь созданный.
3. Дальше в терминале набираем команду: docker run -p 500:500 --name citygamecont(имя контейнера, может быть и другим) citygame(имя созданного вами ранее image), запустится контейнер.
4. Переходим в браузер и вводим  http://localhost:500/, приложение запустится.
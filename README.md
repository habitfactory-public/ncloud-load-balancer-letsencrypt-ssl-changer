# ncloud 로드밸런서 ssl 인증서 자동 변경 스크립트
letsencrypt의 인증서를 자동으로 ncloud의 로드밸런서에 추가해주는 스크립트입니다. nodejs 6.x 이상에서 동작합니다.

# 설치
```shell
> npm install
> (혹은 yarn)
```

# 사용법
- ssl-changer.sh 내의 변수를 본인의 환경에 맞게 변경
- letsencrypt의 renew-hook에 ssl-changer.sh를 추가
```shell
> /usr/bin/certbot renew --quiet --renew-hook "/bin/systemctl reload nginx" --renew-hook "/path/to/script/ssl-changer.sh"
```

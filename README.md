## Descrição

API que fornece imagens que estão salvas no AWS S3.

## Configuração

```bash
# Criar o .env
$ echo "AWS_ACCESS_KEY_ID=AKIAT7JJU57BAR44XQBU\nAWS_SECRET_ACCESS_KEY=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\nAWS_REGION=us-east-1\nAWS_BUCKET_NAME=seletivo-weedoit" > .env

# Rodar a api e subir o banco de dados
$ docker-compose up
```

## Experimentar a API

Abra o arquivo `index.html` no navegador.

## _[WIP]_ Como melhorar a performance

### Usar CDN

Recomendo configurar uma CDN no domínio da API para cachear ao redor do mundo.

### Localização do bucket S3

Recomendo fazer o deploy da API na mesma localização do bucket para diminuir a latencia entre eles.

### Index no banco

O endpoint checa se existe um cache da imagem no banco de dados e, caso exista, ele retorna. Nesse caso, é importante garantir que os campos envolvidos estejam indexados. No momento, ele usa o campo `uniqueId`, que já está indexado pelo prisma.

## Descrição

API que fornece imagens que estão salvas no AWS S3.

## Configuração

```bash
# Criar o .env
$ echo "AWS_ACCESS_KEY_ID=https://seletivo-weedoit.s3.amazonaws.com" > .env

# Rodar a api e subir o banco de dados
$ docker-compose up
```

## Experimentar a API

Abra o arquivo `index.html` no navegador.

## Como melhorar a performance

### Usar CDN

Recomendo configurar uma CDN no domínio da API para cachear ao redor do mundo.

### Localização do bucket S3

Recomendo fazer o deploy da API na mesma localização do bucket para diminuir a latencia entre eles.

### Index no banco

O endpoint checa se existe um cache da imagem no banco de dados e, caso exista, ele retorna. Nesse caso, é importante garantir que os campos envolvidos estejam indexados. No momento, ele usa o campo `uniqueId`, que já está indexado pelo prisma.

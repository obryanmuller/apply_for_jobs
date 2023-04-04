# Avaliação de conhecimentos em Desenvolvimento de Software

## Considere a seguinte necessidade:
 
Precisamos enviar uma senha de maneira segura para um cliente. Para isso, ao invés de encaminhá-la via E-mail, SMS, Slack, etc, foi dado como solução o desenvolvimento de um sistema com as seguintes funções:
 
1- Usuário irá inserir uma <strong>senha</strong> ou solicitar ao Sistema para gerar <strong>senha aleatória</strong> baseada em <strong>políticas de complexidade</strong> (tipo de caracteres, números, letras, tamanho, etc); 
- **Exemplo1**: o usuário digita sua senha no campo de texto;
- **Exemplo2**: o usuário seleciona os parametros de complexidade de senha e ao clicar no botão "Gerar Senha" irá obter uma senha aleatória;

2- Usuário irá especificar <strong>quantas vezes</strong> a senha gerada poderá ser vista e <strong>qual o tempo</strong> que a senha ficará válida;
- **Exemplo**: o usuário irá especificar que a senha possa ser vista apenas <em>duas vezes</em> pelo prazo de <em>um dia</em>;

3- O sistema irá <strong>gerar uma URL</strong> que dá acesso a visualização da senha, baseando-se nos critérios do item 02;
- **Exemplo**: o usuário enviará a URL para que o cliente possa visualizar a senha;

4- Após atingir a quantidade de visualizações ou o tempo disponível, o sistema <strong>bloqueia/elimina</strong> a visualização da senha (expirado).
A senha <strong>não deve ser armazenada</strong> após sua expiração
- **Exemplo1**: 
    Senha foi gerada para 2 visualizações e 2 dias de prazo. 
    Cliente clicou na url 3 vezes seguidas no primeiro dia.
    1º acesso: senha disponível e pôde ser visualizada. Contador atualizado para 1 view
    2º acesso: senha disponível e pôde ser visualizada. Contador atualizado para 2 views=limite definido. Senha deletada
    3º acesso: senha já deletada da base. Retorna mensagem de senha indispovível
- **Exemplo2**: 
    Senha foi gerada para 2 visualizações e 2 dias de prazo. 
    Cliente só clicou na url depois de 4 dias que a mesma foi gerada.
    1º acesso: senha já deletada da base após o prazo de 2 dias. Retorna mensagem de senha indispovível
- **Exemplo3**: 
    Senha foi gerada para 2 visualizações e 2 dias de prazo. 
    Cliente clicou na url 2 vezes: uma assim que recebeu a mesma e a segunda depois de 5 dias.
    1º acesso: senha disponível e pôde ser visualizada. Contador atualizado para 1 view
    2º acesso: senha já deletada da base após o prazo de 2 dias. Retorna mensagem de senha indispovível

## Design

1 - <strong>Monte um desenho</strong> com a arquitetura desse sistema, considerando todos os <strong>componentes e tecnologias</strong> necessárias para o seu correto funcionamento. Considere essa topologia utilizando, obrigatoriamente, provedores de nuvens públicas trabalhando com o <strong>conceito de serverless</strong>. Escolha a nuvem que tiver mais conforto em trabalhar (AWS, GCP, Azure, etc). Para o backend recomendamos o uso dos serviços:
- AWS: Lambda, API Gateway, DynamoDB, entre outros que não precisem de servidor (dessa forma, desaconselhamos o uso de EC2, EKS, RDS, etc)
- GCP: Cloud Functions, Cloud Endpoints, Cloud Firestore, entre outros que não precisem de servidor (dessa forma, desaconselhamos o uso de Compute Engine, GKE, Cloud SQL, etc)
- Azure: Functions, API Management, CosmosDB, entre outros que não precisem de servidor (dessa forma, desaconselhamos o uso de Virtual Machine, AKS, SQL Database, etc)
 
2 - Explique como atender cada uma das 4 funções elencadas acima (requisítos) e o racional de sua decisão. 
- **Exemplo**: A senha aleatória será gerada no front-end por xyz, ou será gerada com uma função no backend por abc.
 
3 - <strong>Opcional:</strong> Avalie quais <strong>controles de segurança</strong> são pertinentes para esse sistema, com o objetivo de protegê-lo ao máximo, evitando vazamento de dados (ex: considere o <strong>OWASP Top10</strong>). Questões de auditoria e logging são importantes também. 

4 - Sinta-se livre para adicionar seus comentários de novas melhorias que você julgar desejável. A TOTVS estimula a criatividade e a liberdade de expressão!
 
Faça uma sucinta explicação sobre o racional do seu desenho.

Essa documentação pode ser entregue em um arquivo pdf ou como parte da documentação no repositório (Arquivos MarkDown com topologia no Draw.io, etc)

## Implementação

Faça um Fork desse repositório, Crie uma branch com seu nome (ex: application/jose_silva). 

Envie um PR nesse repositorio do GitHub contendo <strong>as implementações</strong> do projeto com base na arquitetura descrita que você desenvolveu do sistema (Queremos avaliar sua lógica de programação e estruturação do código). 

Para testar as implementações de seu projeto antes de enviar, recomendamos o uso do free tier das nuvens públicas ou projetos que emulem localmente tais nuvens como o localstack (https://github.com/localstack/localstack).
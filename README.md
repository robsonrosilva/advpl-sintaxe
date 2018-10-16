# advpl-sintax README

Extensão para automatização de merges do GIT e análise de códigos ADVPL.

## Release Notes
### 0.2.1  - 2018-10-16
- Ajuste de identificação de tabela chumbada.

### 0.2.0  - 2018-10-16
- Criação de análise de tags, onde serão varidas as tags do padrão N.N.N e gerado um arquivo na raiz com as pendências de cada TAG.
- Melhorada a identificação de tabelas chumbadas em queries.

### 0.1.1  - 2018-10-10
- Melhoria na identificação UPDATE, SELECT, JOIN e DELETE na mesma linha.

### 0.1.0  - 2018-10-10
- Melhoria na identificação de comentários.

### 0.0.9  - 2018-10-08
- Executa as validações de projeto quando chama as rotinas do GIT.

### 0.0.8  - 2018-10-08
- Correção do Fluxo de merge para a Master.
- Criticas de DELETE FROM.
- Criticas de Erro de Commit.

### 0.0.7  - 2018-10-06
- Montagem de settings para padrão de comentário de fonte.

### 0.0.6  - 2018-10-05
- Implementação para aceitar vários bancos de dados.
- Ajuste para identificação no Settings de configurações de extensão.
- Segregação de classes de Merge e de Validação.
- Melhoria de identificação de banco de dados fixo no fonte.
- Recomendação de identação de queryes para melhor análise.

### 0.0.5  - 2018-10-05
- Alteração de classificações de mensagens de Error para Warning.
- Criação de regra para verificar tabelas fixas em query.

### 0.0.4  - 2018-10-05
- Criação de informação para comentário de fonte fora do padrão.
- Identificação de fontes com extensão em caixa alta.
- Adição de Snippets.
- Criação de comando para validação de projeto.
- Criticas de comentários de fontes e funções.

### 0.0.3 - 2018-10-04
- Criado variavel cSelect para indentificar Query e validar o owner.
- Criação de variáveis de Workspace para extensão.
- Melhoria na identificação de owner.

### 0.0.2 - 2018-10-04
- Validação de todo o projeto na abertura.
- Ajuste de validação que Select com *.
- Alert para utilização de CRLF em vez de funções.

### 0.0.1 - 2018-10-04
- Foi implementada a Validação de fontes básica e os merges.

**Enjoy!**

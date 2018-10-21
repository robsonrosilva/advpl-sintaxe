# advpl-sintax README

Extensão para automatização de merges do GIT e análise de códigos ADVPL.

## Release Notes
### 0.4.0  - 2018-10-21
- Montagem de objeto de análise de includes.
    -    Analisados - TOPCONN, TBICONN, REPORT, AP5MAIL, APWIZARD, FILEIO, TBICODE, PARMTYPE, FWMVCDEF, AARRAY, RPTDEF, 
                 FWPRINTSETUP, APWEBSRV, APWEBEX e MSOLE.
    - Obsoletos - PROTHEUS, DIALOG, FONT, PTMENU, PRINT, COLORS, FOLDER, MSOBJECT, VKEY, WINAPI, FWCOMMAND e FWCSS.

### 0.3.7  - 2018-10-19
- Crítica de RWMAKE.CH obsoleto.

### 0.3.6  - 2018-10-19
- Correção de erro de identificação de PROTHEUS.CH.

### 0.3.5  - 2018-10-19
- Crítica de PROTHEUS.CH obsoleto.

### 0.3.4  - 2018-10-19
- Análise de TBICONN.CH sem PREPARE ENVIRONMENT.
- Análise de PREPARE ENVIRONMENT sem TBICONN.CH.
- Análise de includes duplicados.

### 0.3.3  - 2018-10-18
- Correção de mensagens dadas quando for executar TcSqlExec.

### 0.3.2  - 2018-10-18
- Correção de mensagem na análise de projeto.

### 0.3.1  - 2018-10-17
- Tratamentos de erros na extensão.
- Ajuste de mensagem de MERGE.

### 0.3.0  - 2018-10-17
- Mudança de execução de rotinas de forma síncrona.

### 0.2.1  - 2018-10-16
- Ajuste de identificação de tabela fixas.

### 0.2.0  - 2018-10-16
- Criação de análise de tags, onde serão varridas as tags do padrão N.N.N e gerado um arquivo na raiz com as pendências de cada TAG.
- Melhorada a identificação de tabelas fixas em queries.

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
- Criado variável cSelect para identificar Query e validar o owner.
- Criação de variáveis de Workspace para extensão.
- Melhoria na identificação de owner.

### 0.0.2 - 2018-10-04
- Validação de todo o projeto na abertura.
- Ajuste de validação que Select com *.
- Alert para utilização de CRLF em vez de funções.

### 0.0.1 - 2018-10-04
- Foi implementada a Validação de fontes básica e os merges.

**Enjoy!**

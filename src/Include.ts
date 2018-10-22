import * as vscode from 'vscode';
import { ValidaAdvpl } from './ValidaAdvpl';

export class Include {
    private includeExpressoes: any[];
    private includesObsoletos: string[];

    constructor() {
        this.includesObsoletos = [];
        this.includesObsoletos.push("PROTHEUS.CH");
        this.includesObsoletos.push("DIALOG.CH");
        this.includesObsoletos.push("FONT.CH");
        this.includesObsoletos.push("PTMENU.CH");
        this.includesObsoletos.push("PRINT.CH");
        this.includesObsoletos.push("COLORS.CH");
        this.includesObsoletos.push("FOLDER.CH");
        this.includesObsoletos.push("MSOBJECT.CH");
        this.includesObsoletos.push("VKEY.CH");
        this.includesObsoletos.push("WINAPI.CH");
        this.includesObsoletos.push("FWCOMMAND.CH");
        this.includesObsoletos.push("FWCSS.CH");
        this.includesObsoletos.push("RWMAKE.CH");

        this.includeExpressoes = [];
        //TOPCONN.CH
        this.includeExpressoes.push({
            expressoes: [/TCQUERY+(((\ )|(\t)))/],
            include: "TOPCONN.CH",
            precisa: false
        });
        //TBICONN.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t))+CREATE+((\ )|(\t))+RPCCONN+(((\ )|(\t)))/,
                /((\ )|(\t))+CLOSE+((\ )|(\t))+RPCCONN+(((\ )|(\t)))/,
                /((\ )|(\t))+PREPARE+((\ )|(\t))+ENVIRONMENT+(((\ )|(\t)))/,
                /((\ )|(\t))+RESET+((\ )|(\t))+ENVIRONMENT+(((\ )|(\t)))/,
                /((\ )|(\t))+OPEN+((\ )|(\t))+REMOTE+((\ )|(\t))+TRANSACTION+(((\ )|(\t)))/,
                /((\ )|(\t))+CLOSE+((\ )|(\t))+REMOTE+((\ )|(\t))+TRANSACTION+(((\ )|(\t)))/,
                /((\ )|(\t))+CALLPROC+((\ )|(\t))+IN+(((\ )|(\t)))/,
                /((\ )|(\t))+OPEN+((\ )|(\t))+REMOTE+((\ )|(\t))+TABLES+(((\ )|(\t)))/
            ],
            include: "TBICONN.CH",
            precisa: false
        });
        //REPORT.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t))+DEFINE+((\ )|(\t))+REPORT+((\ )|(\t))+.+((\ )|(\t))+NAME+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+SECTION+((\ )|(\t))+.+((\ )|(\t))+OF+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+CELL+((\ )|(\t))+NAME+((\ )|(\t))+.+((\ )|(\t))+OF+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+BREAK+((\ )|(\t))+OF+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+FUNCTION+((\ )|(\t))+FROM+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+COLLECTION+((\ )|(\t))+.+((\ )|(\t))+OF+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+BORDER+((\ )|(\t))+.+((\ )|(\t))+OF+((\ )|(\t))+/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+HEADER+((\ )|(\t))+BORDER+((\ )|(\t))+.+((\ )|(\t))+OF+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+CELL+((\ )|(\t))+BORDER+((\ )|(\t))+.+((\ )|(\t))+OF+(((\ )|(\t)))/,
                /((\ )|(\t))+DEFINE+((\ )|(\t))+CELL+((\ )|(\t))+HEADER+((\ )|(\t))+BORDER+((\ )|(\t))+.+((\ )|(\t))+OF+(((\ )|(\t)))/
            ],
            include: "REPORT.CH",
            precisa: false
        });
        //AP5MAIL.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t))+CONNECT+((\ )|(\t))+SMTP+((\ )|(\t))+SERVER/,
                /((\ )|(\t))+CONNECT+((\ )|(\t))+POP+((\ )|(\t))+SERVER/,
                /((\ )|(\t))+DISCONNECT+((\ )|(\t))+SMTP+((\ )|(\t))+SERVER/,
                /((\ )|(\t))+DISCONNECT+((\ )|(\t))+POP+((\ )|(\t))+SERVER/,
                /((\ )|(\t))+POP+((\ )|(\t))+MESSAGE+((\ )|(\t))+COUNT/,
                /((\ )|(\t))+SEND+((\ )|(\t))+MAIL+((\ )|(\t))+FROM/,
                /((\ )|(\t))+GET+((\ )|(\t))+MAIL+((\ )|(\t))+ERROR/,
                /((\ )|(\t))+RECEIVE+((\ )|(\t))+MAIL+((\ )|(\t))+MESSAGE/
            ],
            include: "AP5MAIL.CH",
            precisa: false
        });
        //APWIZARD.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t))+DEFINE+((\ )|(\t))+WIZARD/,
                /((\ )|(\t))+ACTIVATE+((\ )|(\t))+WIZARD/,
                /((\ )|(\t))+CREATE+((\ )|(\t))+PANEL/
            ],
            include: "APWIZARD.CH",
            precisa: false
        });
        //FILEIO.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+F_ERROR/,
                /((\ )|(\t)|(\()|(\,))+FS_SET/,
                /((\ )|(\t)|(\()|(\,))+FS_RELATIVE/,
                /((\ )|(\t)|(\()|(\,))+FS_END/,
                /((\ )|(\t)|(\()|(\,))+FO_READ/,
                /((\ )|(\t)|(\()|(\,))+FO_WRITE/,
                /((\ )|(\t)|(\()|(\,))+FO_READWRITE/,
                /((\ )|(\t)|(\()|(\,))+FO_COMPAT/,
                /((\ )|(\t)|(\()|(\,))+FO_EXCLUSIVE/,
                /((\ )|(\t)|(\()|(\,))+FO_DENYWRITE/,
                /((\ )|(\t)|(\()|(\,))+FO_DENYREAD/,
                /((\ )|(\t)|(\()|(\,))+FO_DENYNONE/,
                /((\ )|(\t)|(\()|(\,))+FO_SHARED/,
                /((\ )|(\t)|(\()|(\,))+FC_NORMAL/,
                /((\ )|(\t)|(\()|(\,))+FC_READONLY/,
                /((\ )|(\t)|(\()|(\,))+FC_HIDDEN/,
                /((\ )|(\t)|(\()|(\,))+FC_SYSTEM/,
                /((\ )|(\t)|(\()|(\,))+FD_RAW/,
                /((\ )|(\t)|(\()|(\,))+FD_BINARY/,
                /((\ )|(\t)|(\()|(\,))+FD_COOKED/,
                /((\ )|(\t)|(\()|(\,))+FD_TEXT/,
                /((\ )|(\t)|(\()|(\,))+FD_ASCII/
            ],
            include: "FILEIO.CH",
            precisa: false
        });
        //TBICODE.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+RPC_LOGIN/,
                /((\ )|(\t)|(\()|(\,))+RPC_LOGOFF/,
                /((\ )|(\t)|(\()|(\,))+RPC_SEND_COTACAO/,
                /((\ )|(\t)|(\()|(\,))+RPC_ESTORNA_COTACAO/,
                /((\ )|(\t)|(\()|(\,))+RPC_READ_COTACAO/,
                /((\ )|(\t)|(\()|(\,))+RPC_SEND_ORCAMENTO/,
                /((\ )|(\t)|(\()|(\,))+RPC_ESTORNA_ORCAMENTO/,
                /((\ )|(\t)|(\()|(\,))+RPC_READ_ORCAMENTO/
            ],
            include: "TBICODE.CH",
            precisa: false
        });
        //PARMTYPE.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+PARAMEXCEPTION/,
                /((\ )|(\t)|(\()|(\,))+CLASSEXCEPTION/,
                /((\ )|(\t)|(\()|(\,))+CLASSPARAMEXCEPTION/,
                /((\ )|(\t)|(\()|(\,))+BLOCKPARAMEXCEPTION/,
                /((\ )|(\t)|(\()|(\,))+PARAMTYPE/
            ],
            include: "PARMTYPE.CH",
            precisa: false
        });
        //FWMVCDEF.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+FORM_STRUCT_TABLE_/,
                /((\ )|(\t)|(\()|(\,))+FORM_STRUCT_CARGO_/,
                /((\ )|(\t)|(\()|(\,))+MVC_BUTTON_/,
                /((\ )|(\t)|(\()|(\,))+MVC_TOOLBAR_/,
                /((\ )|(\t)|(\()|(\,))+MODELO_PK_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_TRIGGER_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_FIELD_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_RELATION_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_STRUCT_/,
                /((\ )|(\t)|(\()|(\,))+STRUCT_FEATURE_/,
                /((\ )|(\t)|(\()|(\,))+STRUCT_RULES_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_GRID_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_GRIDLINE_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_RULES_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_MSGERR_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_OPERATION_/,
                /((\ )|(\t)|(\()|(\,))+MVC_LOADFILTER_/,
                /((\ )|(\t)|(\()|(\,))+MODEL_CONTROL_/,
                /((\ )|(\t)|(\()|(\,))+VIEWS_VIEW_/,
                /((\ )|(\t)|(\()|(\,))+MVC_VIEW_/,
                /((\ )|(\t)|(\()|(\,))+MVC_MODEL_/,
                /((\ )|(\t)|(\()|(\,))+FORMSTRUFIELD/,
                /((\ )|(\t)|(\()|(\,))+FORMSTRUTRIGGER/,
                /((\ )|(\t)|(\()|(\,))+VIEWSTRUFIELD/,
                /((\ )|(\t)|(\()|(\,))+VIEWSTRUFOLDER/,
                /((\ )|(\t)|(\()|(\,))+VIEWSTRUDOCKWINDOW/,
                /((\ )|(\t)|(\()|(\,))+VIEWSTRUGROUP/,
                /((\ )|(\t)|(\()|(\,))+VIEW_BUTTON_/,
                /((\ )|(\t)|(\()|(\,))+OP_PESQUISAR/,
                /((\ )|(\t)|(\()|(\,))+OP_VISUALIZAR/,
                /((\ )|(\t)|(\()|(\,))+OP_INCLUIR/,
                /((\ )|(\t)|(\()|(\,))+OP_ALTERAR/,
                /((\ )|(\t)|(\()|(\,))+OP_EXCLUIR/,
                /((\ )|(\t)|(\()|(\,))+OP_IMPRIMIR/,
                /((\ )|(\t)|(\()|(\,))+OP_COPIA/,
                /((\ )|(\t)|(\()|(\,))+ADD+((\ )|(\t))+FWTOOLBUTTON/,
                /((\ )|(\t)|(\()|(\,))+NEW+((\ )|(\t))+MODEL/,
                /((\ )|(\t)|(\()|(\,))+PUBLISH+((\ )|(\t))+MODEL+((\ )|(\t))+REST+((\ )|(\t))+NAME/,
                /((\ )|(\t)|(\()|(\,))+ADD+((\ )|(\t))+OPTION+((\ )|(\t))+.+((\ )|(\t))+TITLE+((\ )|(\t))+.+((\ )|(\t))+ACTION+((\ )|(\t))+.+((\ )|(\t))+OPERATION+((\ )|(\t))+.+((\ )|(\t))+ACCESS+((\ )|(\t))/
            ],
            include: "FWMVCDEF.CH",
            precisa: false
        });
        //AARRAY.CH
        this.includeExpressoes.push({
            expressoes: [
                /\[+\#+.+\]/
            ],
            include: "AARRAY.CH",
            precisa: false
        });
        //RPTDEF.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+CELL_ALIGN_LEFT/,
                /((\ )|(\t)|(\()|(\,))+CELL_ALIGN_CENTER/,
                /((\ )|(\t)|(\()|(\,))+CELL_ALIGN_RIGHT/,
                /((\ )|(\t)|(\()|(\,))+BORDER_NONE/,
                /((\ )|(\t)|(\()|(\,))+BORDER_CONTINUOUS/,
                /((\ )|(\t)|(\()|(\,))+BORDER_PARENT/,
                /((\ )|(\t)|(\()|(\,))+BORDER_HEADERPARENT/,
                /((\ )|(\t)|(\()|(\,))+BORDER_CELL/,
                /((\ )|(\t)|(\()|(\,))+BORDER_FUNCTION/,
                /((\ )|(\t)|(\()|(\,))+BORDER_SECTION/,
                /((\ )|(\t)|(\()|(\,))+EDGE_TOP/,
                /((\ )|(\t)|(\()|(\,))+EDGE_BOTTOM/,
                /((\ )|(\t)|(\()|(\,))+EDGE_LEFT/,
                /((\ )|(\t)|(\()|(\,))+EDGE_RIGHT/,
                /((\ )|(\t)|(\()|(\,))+EDGE_ALL/,
                /((\ )|(\t)|(\()|(\,))+NEGATIVE_PARENTHESES/,
                /((\ )|(\t)|(\()|(\,))+NEGATIVE_SIGNAL/,
                /((\ )|(\t)|(\()|(\,))+IMP_DISCO/,
                /((\ )|(\t)|(\()|(\,))+IMP_SPOOL/,
                /((\ )|(\t)|(\()|(\,))+IMP_EMAIL/,
                /((\ )|(\t)|(\()|(\,))+IMP_EXCEL/,
                /((\ )|(\t)|(\()|(\,))+IMP_HTML/,
                /((\ )|(\t)|(\()|(\,))+IMP_PDF/,
                /((\ )|(\t)|(\()|(\,))+IMP_ODF/,
                /((\ )|(\t)|(\()|(\,))+IMP_PDFMAIL/,
                /((\ )|(\t)|(\()|(\,))+IMP_MAILCOMPROVA/,
                /((\ )|(\t)|(\()|(\,))+IMP_ECM/,
                /((\ )|(\t)|(\()|(\,))+AMB_SERVER/,
                /((\ )|(\t)|(\()|(\,))+AMB_CLIENT/,
                /((\ )|(\t)|(\()|(\,))+AMB_ECM+(((\ )|(\t)))/,
                /((\ )|(\t)|(\()|(\,))+PORTRAIT+(((\ )|(\t)))/,
                /((\ )|(\t)|(\()|(\,))+LANDSCAPE+(((\ )|(\t)))/,
                /((\ )|(\t)|(\()|(\,))+NO_REMOTE/,
                /((\ )|(\t)|(\()|(\,))+REMOTE_DELPHI/,
                /((\ )|(\t)|(\()|(\,))+REMOTE_QTWIN/,
                /((\ )|(\t)|(\()|(\,))+REMOTE_QTLINUX/,
                /((\ )|(\t)|(\()|(\,))+TYPE_CELL/,
                /((\ )|(\t)|(\()|(\,))+TYPE_FORMULA/,
                /((\ )|(\t)|(\()|(\,))+TYPE_FUNCTION/,
                /((\ )|(\t)|(\()|(\,))+TYPE_USER/,
                /((\ )|(\t)|(\()|(\,))+COLLECTION_VALUE/,
                /((\ )|(\t)|(\()|(\,))+COLLECTION_REPORT/,
                /((\ )|(\t)|(\()|(\,))+COLLECTION_SECTION/,
                /((\ )|(\t)|(\()|(\,))+COLLECTION_PAGE/,
                /((\ )|(\t)|(\()|(\,))+TSEEK/,
                /((\ )|(\t)|(\()|(\,))+TCACHE/,
                /((\ )|(\t)|(\()|(\,))+TSTRUCT/,
                /((\ )|(\t)|(\()|(\,))+TALIAS/,
                /((\ )|(\t)|(\()|(\,))+TDESC/,
                /((\ )|(\t)|(\()|(\,))+FSTRUCTALL/,
                /((\ )|(\t)|(\()|(\,))+FSTRUCTFIELD/,
                /((\ )|(\t)|(\()|(\,))+FTITLE/,
                /((\ )|(\t)|(\()|(\,))+FTOOLTIP/,
                /((\ )|(\t)|(\()|(\,))+FFIELD/,
                /((\ )|(\t)|(\()|(\,))+FTYPE/,
                /((\ )|(\t)|(\()|(\,))+FSIZE/,
                /((\ )|(\t)|(\()|(\,))+FDECIMAL/,
                /((\ )|(\t)|(\()|(\,))+FCOMBOBOX/,
                /((\ )|(\t)|(\()|(\,))+FOBRIGAT/,
                /((\ )|(\t)|(\()|(\,))+FUSED/,
                /((\ )|(\t)|(\()|(\,))+FCONTEXT/,
                /((\ )|(\t)|(\()|(\,))+FNIVEL/,
                /((\ )|(\t)|(\()|(\,))+FTABLE/,
                /((\ )|(\t)|(\()|(\,))+FPICTURE/,
                /((\ )|(\t)|(\()|(\,))+FCONPAD/,
                /((\ )|(\t)|(\()|(\,))+ISTRUCTALL/,
                /((\ )|(\t)|(\()|(\,))+ISTRUCTINDEX/,
                /((\ )|(\t)|(\()|(\,))+IDESC/,
                /((\ )|(\t)|(\()|(\,))+IKEY/,
                /((\ )|(\t)|(\()|(\,))+IDESC/,
                /((\ )|(\t)|(\()|(\,))+ITABLE/,
                /((\ )|(\t)|(\()|(\,))+PGROUP/,
                /((\ )|(\t)|(\()|(\,))+PORDER/,
                /((\ )|(\t)|(\()|(\,))+PGSC/,
                /((\ )|(\t)|(\()|(\,))+PTYPE/,
                /((\ )|(\t)|(\()|(\,))+PDESC/,
                /((\ )|(\t)|(\()|(\,))+PPERG1/,
                /((\ )|(\t)|(\()|(\,))+PPERG2/,
                /((\ )|(\t)|(\()|(\,))+PPERG3/,
                /((\ )|(\t)|(\()|(\,))+PPERG4/,
                /((\ )|(\t)|(\()|(\,))+PPERG5/,
                /((\ )|(\t)|(\()|(\,))+PPYME/,
                /((\ )|(\t)|(\()|(\,))+PPICTURE/
            ],
            include: "RPTDEF.CH",
            precisa: false
        });
        //FWPRINTSETUP.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+PD_ISTOTVSPRINTER/,
                /((\ )|(\t)|(\()|(\,))+PD_DISABLEDESTINATION/,
                /((\ )|(\t)|(\()|(\,))+PD_DISABLEORIENTATION/,
                /((\ )|(\t)|(\()|(\,))+PD_DISABLEPAPERSIZE/,
                /((\ )|(\t)|(\()|(\,))+PD_DISABLEPREVIEW/,
                /((\ )|(\t)|(\()|(\,))+PD_DISABLEMARGIN/,
                /((\ )|(\t)|(\()|(\,))+PD_TYPE_FILE/,
                /((\ )|(\t)|(\()|(\,))+PD_TYPE_SPOOL/,
                /((\ )|(\t)|(\()|(\,))+PD_TYPE_EMAIL/,
                /((\ )|(\t)|(\()|(\,))+PD_TYPE_EXCEL/,
                /((\ )|(\t)|(\()|(\,))+PD_TYPE_HTML/,
                /((\ )|(\t)|(\()|(\,))+PD_TYPE_PDF/,
                /((\ )|(\t)|(\()|(\,))+PD_DESTINATION/,
                /((\ )|(\t)|(\()|(\,))+PD_PRINTTYPE/,
                /((\ )|(\t)|(\()|(\,))+PD_ORIENTATION/,
                /((\ )|(\t)|(\()|(\,))+PD_PAPERSIZE/,
                /((\ )|(\t)|(\()|(\,))+PD_PREVIEW/,
                /((\ )|(\t)|(\()|(\,))+PD_VALUETYPE/,
                /((\ )|(\t)|(\()|(\,))+PD_MARGIN/,
                /((\ )|(\t)|(\()|(\,))+PD_MARGIN_LEFT/,
                /((\ )|(\t)|(\()|(\,))+PD_MARGIN_TOP/,
                /((\ )|(\t)|(\()|(\,))+PD_MARGIN_RIGHT/,
                /((\ )|(\t)|(\()|(\,))+PD_MARGIN_BOTTOM/,
                /((\ )|(\t)|(\()|(\,))+PD_OK/,
                /((\ )|(\t)|(\()|(\,))+PD_CANCEL/
            ],
            include: "FWPRINTSETUP.CH",
            precisa: false
        });
        //APWEBSRV.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+SOAPFAULT_VERSIONMISMATCH/,
                /((\ )|(\t)|(\()|(\,))+SOAPFAULT_MUSTUNDERSTAND/,
                /((\ )|(\t)|(\()|(\,))+SOAPFAULT_DTDNOTSUPPORTED/,
                /((\ )|(\t)|(\()|(\,))+SOAPFAULT_DATAENCODINGUNKNOWN/,
                /((\ )|(\t)|(\()|(\,))+SOAPFAULT_SENDER/,
                /((\ )|(\t)|(\()|(\,))+SOAPFAULT_RECEIVER/,
                /((\ )|(\t)|(\()|(\,))+BYREF/,
                /((\ )|(\t)|(\()|(\,))+WSSTRUCT/,
                /((\ )|(\t)|(\()|(\,))+WSSERVICE/,
                /((\ )|(\t)|(\()|(\,))+WSCLIENT/,
                /((\ )|(\t)|(\()|(\,))+WSMETHOD/,
                /((\ )|(\t)|(\()|(\,))+_WSPARMS_/,
                /((\ )|(\t)|(\()|(\,))+WSDATA/
            ],
            include: "APWEBSRV.CH",
            precisa: false
        });
        //APWEBEX.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t))+OPEN+((\ )|(\t))+QUERY+((\ )|(\t))+ALIAS/,
                /((\ )|(\t))+CLOSE+((\ )|(\t))+QUERY/,
                /((\ )|(\t))+WEB+((\ )|(\t))+EXTENDED+((\ )|(\t))+INIT/,
                /((\ )|(\t))+WEB+((\ )|(\t))+EXTENDED+((\ )|(\t))+END/
            ],
            include: "APWEBEX.CH",
            precisa: false
        });
        //MSOLE.CH
        this.includeExpressoes.push({
            expressoes: [
                /((\ )|(\t)|(\()|(\,))+OLEONERROR/,
                /((\ )|(\t)|(\()|(\,))+OLEWDLEFT/,
                /((\ )|(\t)|(\()|(\,))+OLEWDTOP/,
                /((\ )|(\t)|(\()|(\,))+OLEWDWIDTH/,
                /((\ )|(\t)|(\()|(\,))+OLEWDHEIGHT/,
                /((\ )|(\t)|(\()|(\,))+OLEWDCAPTION/,
                /((\ )|(\t)|(\()|(\,))+OLEWDVISIBLE/,
                /((\ )|(\t)|(\()|(\,))+OLEWDWINDOWSTATE/,
                /((\ )|(\t)|(\()|(\,))+OLEWDPRINTBACK/,
                /((\ )|(\t)|(\()|(\,))+OLEWDVERSION/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATDOCUMENT/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATTEMPLATE/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATTEXT/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATTEXTLINEBREAKS/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATDOSTEXT/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATDOSTEXTLINEBREAKS/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATRTF/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATUNICODETEXT/,
                /((\ )|(\t)|(\()|(\,))+WDFORMATHTML/,
                /((\ )|(\t)|(\()|(\,))+WDFORMATDOCUMENTDEFAULT/,
                /((\ )|(\t)|(\()|(\,))+OLEWDFORMATHTML/
            ],
            include: "MSOLE.CH",
            precisa: false
        });
    }
    public valida(objetoValidacao: ValidaAdvpl, conteudoFile: String) {
        //Monta array com includes no fonte
        let includesFonte = objetoValidacao.includes.map((x: any) => x.include);
        let includesAnalise = this.includeExpressoes.map((x: any) => x.include);

        if (!objetoValidacao.includes.indexOf((x: any) => x.include === "TOTVS.CH")) {
            objetoValidacao.aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0),
                'Falta o include TOTVS.CH !',
                vscode.DiagnosticSeverity.Warning)
            );
        }

        //Busca includes duplicados
        objetoValidacao.includes.forEach((include: any) => {
            //Verifica se o include é obsoleto
            if (
                this.includesObsoletos.indexOf(include.include) !== -1
            ) {
                objetoValidacao.aErros.push(new vscode.Diagnostic(new vscode.Range(include.linha, 0, include.linha, 0),
                    'O include ' + include.include + ' é obsoleto, o mesmo foi substituído pelo TOTVS.CH!',
                    vscode.DiagnosticSeverity.Warning)
                );
            }

            //Verifica se há o mesmo include em uma linha diferente do mesmo fonte
            if (
                objetoValidacao.includes.findIndex(
                    function (x: any) {
                        return x.include === include.include && x.linha !== include.linha;
                    }
                ) !== -1
            ) {
                objetoValidacao.aErros.push(new vscode.Diagnostic(new vscode.Range(include.linha, 0, include.linha, 0),
                    'Include ' + include.include + ' em duplicidade!',
                    vscode.DiagnosticSeverity.Warning)
                );
            }
        });

        //valida necessidade de includes
        let linhas = conteudoFile.split("\n");
        for (var key in linhas) {
            //seta linha atual
            let linha = ' ' + linhas[key];

            this.includeExpressoes.forEach(element => {
                element.expressoes.forEach((expressao: RegExp) => {
                    if (linha.search(expressao) !== -1) {
                        element.precisa = true;
                        //se não estiver na lista de includes 
                        if (
                            includesFonte.indexOf(element.include) === -1
                        ) {
                            objetoValidacao.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                                'Falta o import do include ' + element.include + '!',
                                vscode.DiagnosticSeverity.Error)
                            );
                        }
                    }
                });
            });

        }

        //Verifica se o include é desnecessário
        objetoValidacao.includes.forEach((include: any) => {
            //se o include é analisado
            let includeAnalise = this.includeExpressoes[includesAnalise.indexOf(include.include)];
            if (includeAnalise) {
                if (!includeAnalise.precisa) {
                    objetoValidacao.aErros.push(new vscode.Diagnostic(new vscode.Range(include.linha, 0, include.linha, 0),
                        'Include ' + include.include + ' desnecessário!',
                        vscode.DiagnosticSeverity.Warning)
                    );
                }
            }
        });
    }
}
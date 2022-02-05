import { UnlayerDesign } from "../model/unlayer.model";
import { JSDOM } from 'jsdom';

export class Unlayerhtml {
    window: import("jsdom").DOMWindow;

    from(data: string) {
        console.log(1, data);
        let design = {} as UnlayerDesign;
        const body = this.getHtml(data).querySelector("body");

        design.body = {
            rows: Array.from(body?.children ?? []).map((row: any) => {
                return {
                    cells: [12],
                    columns: Array.from(row.children).map((column: any) => {
                        return {
                            contents: Array.from(column).map((content: any, i) => {
                                return {
                                    type: "text",
                                    values: this.htmlStyle2Unlayer(content.style, content.outerHTML, `u_content_${i}`) as any
                                }
                            }),
                            values: this.htmlStyle2Unlayer(column?.style, '', `u_column_${1}`) as any,
                        }
                    }),
                    values: this.htmlStyle2Unlayer(row.style, '', `u_row_${1}`) as any
                }
            }),
            values: this.htmlStyle2Unlayer(body?.style, '', `u_body`) as any
        };

       // console.log(JSON.stringify(design, null, 4));
       return design;
    }

    getHtml = (html: string) => {
        this.window = new JSDOM(html).window;
        return this.window.document;
    }



    /**
    * 
    * @param style Style
    * @param text html
    * @returns Unlayer Values
    */
    htmlStyle2Unlayer = (style: any, text: string = '', id_type?: string) => style ? Object.assign({}, {
        containerPadding: style?.padding,
        color: "",
        headingType: "",
        fontFamily: style["font-family"] ? {
            label: "font",
            value: style["font-family"]
        } : {},
        fontSize: style["font-size"],
        textAlign: style["text-align"],
        lineHeight: style["line-height"],
        linkStyle: style["link-style"],
        displayCondition: null,
        _meta: {
            htmlID: id_type,
            htmlClassNames: id_type?.replace(/_\d/g, "")
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: false,
        text: text,
        size: {
            autoWidth: true,
            width: style?.width
        },
        padding: style["padding"],
        border: {
            borderBottom: style["border-bottom"],
            borderLeft: style["border-left"],
            borderRight: style["border-right"],
            borderTop: style["border-top"]
        },
        borderRadius: style["border-radius"],
        calculatedWidth: null,
        calculatedHeight: null,
        textColor: style["color"],
        backgroundColor: style["background-color"],
        backgroundImage: {
            url: style["background-image"],
            fullWidth: false,
            repeat: false,
            center: true,
            cover: false
        },
        contentWidth: "500px",
        contentAlign: "center",
        preheaderText: "",
        columns: id_type?.includes("column"),
        columnsBackgroundColor: '',
        hideDesktop: false,
    }) : {};
}
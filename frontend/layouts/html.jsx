export default {
    tagStart: /<([\w]+)>/g,
    tagEnd: /<\/>/g,
    text: [
        "<TEXT>" +
        "<DEFAULT_TAG>&lt;!DOCTYPE <DEFAULT_ATTRIBUTE>HTML</> PUBLIC</> <DEFAULT_STRING>\"-//W3C//DTD HTML 3.2//EN\"</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_LINE_COMMENT>&lt;!-- Sample comment --&gt;</>",
        "<DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>HTML</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>head</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>title</><DEFAULT_TAG>&gt;</>IntelliJ IDEA<DEFAULT_TAG>&lt;/</><DEFAULT_KEYWORD>title</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_TAG>&lt;/</><DEFAULT_KEYWORD>head</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>body</><DEFAULT_TAG>&gt;</>",
        "  <DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>h1</><DEFAULT_TAG>&gt;</>IntelliJ IDEA<DEFAULT_TAG>&lt;/</><DEFAULT_KEYWORD>h1</><DEFAULT_TAG>&gt;</>",
        "  <DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>p</><DEFAULT_TAG>&gt;</><DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>br</><DEFAULT_TAG>&gt;</><DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>b</><DEFAULT_TAG>&gt;</><DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>IMG</> <DEFAULT_ATTRIBUTE>border=</><DEFAULT_STRING>0</> <DEFAULT_ATTRIBUTE>height=</><DEFAULT_STRING>12</> <DEFAULT_ATTRIBUTE>src=</><DEFAULT_STRING>\"images/hg.gif\"</> <DEFAULT_ATTRIBUTE>width=</><DEFAULT_STRING>18</> <DEFAULT_TAG>&gt;</>",
        "    Hello<DEFAULT_ENTITY>&amp;nbsp;</>World! <DEFAULT_ENTITY>&amp;#x00B7;</> <DEFAULT_ENTITY>&amp;Alpha;</> <DEFAULT_TAG>&lt;/</><DEFAULT_KEYWORD>b</><DEFAULT_TAG>&gt;</><DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>br</><DEFAULT_TAG>&gt;</><DEFAULT_TAG>&lt;</><DEFAULT_KEYWORD>br</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_TAG>&lt;/</><DEFAULT_KEYWORD>body</><DEFAULT_TAG>&gt;</>",
        "<DEFAULT_TAG>&lt;/</><DEFAULT_KEYWORD>html</><DEFAULT_TAG>&gt;</>",
        "</>"
    ].join("\n")
}

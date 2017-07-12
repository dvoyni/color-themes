export default {
    tagStart: /<([\w]+)>/g,
    tagEnd: /<\/>/g,
    text: [
        "<TEXT>" +
        "<HTML_TAG>&lt;!DOCTYPE <HTML_ATTRIBUTE_NAME>HTML</> PUBLIC</> <HTML_ATTRIBUTE_VALUE>\"-//W3C//DTD HTML 3.2//EN\"</><HTML_TAG>&gt;</>",
        "<HTML_COMMENT>&lt;!-- Sample comment --&gt;</>",
        "<HTML_TAG>&lt;</><HTML_TAG_NAME>HTML</><HTML_TAG>&gt;</>",
        "<HTML_TAG>&lt;</><HTML_TAG_NAME>head</><HTML_TAG>&gt;</>",
        "<HTML_TAG>&lt;</><HTML_TAG_NAME>title</><HTML_TAG>&gt;</>IntelliJ IDEA<HTML_TAG>&lt;/</><HTML_TAG_NAME>title</><HTML_TAG>&gt;</>",
        "<HTML_TAG>&lt;/</><HTML_TAG_NAME>head</><HTML_TAG>&gt;</>",
        "<HTML_TAG>&lt;</><HTML_TAG_NAME>body</><HTML_TAG>&gt;</>",
        "  <HTML_TAG>&lt;</><HTML_TAG_NAME>h1</><HTML_TAG>&gt;</>IntelliJ IDEA<HTML_TAG>&lt;/</><HTML_TAG_NAME>h1</><HTML_TAG>&gt;</>",
        "  <HTML_TAG>&lt;</><HTML_TAG_NAME>p</><HTML_TAG>&gt;</><HTML_TAG>&lt;</><HTML_TAG_NAME>br</><HTML_TAG>&gt;</><HTML_TAG>&lt;</><HTML_TAG_NAME>b</><HTML_TAG>&gt;</><HTML_TAG>&lt;</><HTML_TAG_NAME>IMG</> <HTML_ATTRIBUTE_NAME>border=</><HTML_ATTRIBUTE_VALUE>0</> <HTML_ATTRIBUTE_NAME>height=</><HTML_ATTRIBUTE_VALUE>12</> <HTML_ATTRIBUTE_NAME>src=</><HTML_ATTRIBUTE_VALUE>\"images/hg.gif\"</> <HTML_ATTRIBUTE_NAME>width=</><HTML_ATTRIBUTE_VALUE>18</> <HTML_TAG>&gt;</>",
        "    Hello<HTML_ENTITY_REFERENCE>&amp;nbsp;</>World! <HTML_ENTITY_REFERENCE>&amp;#x00B7;</> <HTML_ENTITY_REFERENCE>&amp;Alpha;</> <HTML_TAG>&lt;/</><HTML_TAG_NAME>b</><HTML_TAG>&gt;</><HTML_TAG>&lt;</><HTML_TAG_NAME>br</><HTML_TAG>&gt;</><HTML_TAG>&lt;</><HTML_TAG_NAME>br</><HTML_TAG>&gt;</>",
        "<HTML_TAG>&lt;/</><HTML_TAG_NAME>body</><HTML_TAG>&gt;</>",
        "<HTML_TAG>&lt;/</><HTML_TAG_NAME>html</><HTML_TAG>&gt;</>",
        "</>"
    ].join("\n"),
    fallback: {
        "HTML_ATTRIBUTE_NAME": ["DEFAULT_ATTRIBUTE"],
        "HTML_ATTRIBUTE_VALUE": ["DEFAULT_STRING"],
        "HTML_COMMENT": ["DEFAULT_LINE_COMMENT"],
        "HTML_ENTITY_REFERENCE": ["DEFAULT_ENTITY"],
        "HTML_TAG": ["DEFAULT_TAG"],
        "HTML_TAG_NAME": ["DEFAULT_KEYWORD"],
    }
}

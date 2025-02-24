import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Base64UploadAdapter,
  BlockQuote,
  BlockToolbar,
  Bold,
  Bookmark,
  Code,
  CodeBlock,
  Emoji,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  Markdown,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  RemoveFormat,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  Title,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const LICENSE_KEY = "GPL"; // or <YOUR_LICENSE_KEY>.

export default function Editor({ initialData, onChange }) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const editorWordCountRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      toolbar: {
        items: [
          "sourceEditing",
          "showBlocks",
          "|",
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "link",
          "insertImage",
          "insertTable",
          "highlight",
          "blockQuote",
          "codeBlock",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        BalloonToolbar,
        Base64UploadAdapter,
        BlockQuote,
        BlockToolbar,
        Bold,
        Bookmark,
        Code,
        CodeBlock,
        Emoji,
        Essentials,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        FullPage,
        GeneralHtmlSupport,
        Heading,
        Highlight,
        HorizontalLine,
        HtmlComment,
        HtmlEmbed,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        ListProperties,
        Markdown,
        MediaEmbed,
        Mention,
        PageBreak,
        Paragraph,
        PasteFromMarkdownExperimental,
        PasteFromOffice,
        RemoveFormat,
        ShowBlocks,
        SourceEditing,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextPartLanguage,
        TextTransformation,
        Title,
        TodoList,
        Underline,
        WordCount,
      ],
      fontFamily: {
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, "default", 18, 20, 22],
        supportAllValues: true,
      },
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
          { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
          { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
          { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
        ],
      },
      placeholder: "Type or paste your content here!",
      initialData, // ✅ Pass initialData correctly
      licenseKey: LICENSE_KEY,
    };
  }, [isLayoutReady, initialData]);

  return (
    <div className="main-container">
      <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {editorConfig && (
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={initialData} // ✅ Set initial value from React Hook Form
                onChange={(event, editor) => {
                  const data = editor.getData();
                  onChange(data); // ✅ Use onChange prop instead of field.onChange
                }}
                onReady={(editor) => {
                  if (editor.plugins.has("WordCount")) {
                    const wordCount = editor.plugins.get("WordCount");
                    editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
                  }
                }}
                onBeforeDestroy={() => {
                  Array.from(editorWordCountRef.current.children).forEach((child) => child.remove());
                }}
              />
            )}
          </div>
        </div>
        <div className="editor_container__word-count" ref={editorWordCountRef}></div>
      </div>
    </div>
  );
}

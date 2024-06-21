import { useState, useEffect } from 'preact/hooks';
import Note from "./Note";
import markdownit from 'markdown-it';
import { fetchNotes } from '../../functions/notes.func';
const md = markdownit();

export default function NoteList() {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const items = await fetchNotes();
    setItems(items);
  }, []);

  return (
    <ol class="note-list">
      {
        items.map(item => (
            <Note item={item} />
          )
        )
      }
    </ol>
  );
}
import { useState, useEffect } from 'preact/hooks';
import Note from "./Note";
import SkeletonList from "./SkeletonList";
import { fetchNotes } from '../../functions/notes.func';

export default function NoteList() {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const items = await fetchNotes();
    setItems(items);
  }, []);
  return (
    <ol class="note-list">
      {
        items.length === 0 ? <SkeletonList /> : null
      }
      {
        items.map(item => (
            <Note item={item} />
          )
        )
      }
    </ol>
  );
}
import { useState, useEffect } from 'preact/hooks';
import Note from "./Note";
import markdownit from 'markdown-it';
const md = markdownit();

const BASE_URL = 'https://directus.aaronczichon.de';

export default function NoteList() {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await fetch(`${BASE_URL}/items/microblog`);
    const result = await response.json();
    let items = result.data;
    // sort items by creation date
    items = items.sort((a, b) => {
      const aCreated = new Date(a.date_created);
      const bCreated = new Date(b.date_created);

      return aCreated > bCreated ? 1 : -1;
    });
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
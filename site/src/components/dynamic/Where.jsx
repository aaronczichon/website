import markdownit from 'markdown-it';
import { useEffect, useState } from 'preact/hooks';

const md = markdownit({
  
});

const fetchWhereContent = async () => {
  const res = await fetch('https://directus.aaronczichon.de/items/personal_website');
  const data = await res.json();
  return {
    where: data.data.where,
    updated_on: data.data.updated_on
  };
}

export default function WhereContent() {
  const [whereContent, setWhereContent] = useState();
  const [lastUpdate, setLastUpdate] = useState();

  useEffect(() => {
    fetchWhereContent().then(content => {
      setWhereContent(content.where);
      setLastUpdate(content.updated_on);
  });
  }, []);

  const getFormattedDate = (date) => {
    const d = new Date(date);
    const browserLang = window.navigator.language;
    return `${d.toLocaleDateString(browserLang, {
      dateStyle: 'medium'
    })}`;
  }

  return (
    <>
    {  whereContent ? <>
      <span dangerouslySetInnerHTML={{__html: md.render(whereContent)}}></span>
      <p class="where-updated">Last updated on: {getFormattedDate(lastUpdate)}</p>
      </> : <>
      <h2 class="skeleton-loader" style="width: 30%; height: 25px"></h2>
        <p>
          <span class="skeleton-loader" style="width: 60%"></span>
          <span class="skeleton-loader" style="width: 80%; margin-top: 4px"></span>
        </p>
        <p>
          <span class="skeleton-loader" style="width: 55%"></span>
        </p>
        <p class="where-updated skeleton-loader" style="height: 12px; width: 35%"></p></>
    }
    </>
  );
}
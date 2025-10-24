// import React, { useEffect } from "react";

// interface SeoProps {
//   title: string;
//   description?: string;
//   canonicalPath?: string;
//   structuredData?: object;
// }

// const Seo: React.FC<SeoProps> = ({
//   title,
//   description,
//   canonicalPath,
//   structuredData,
// }) => {
//   useEffect(() => {
//     // Title
//     document.title = title.length > 60 ? `${title.slice(0, 57)}...` : title;

//     // Meta description
//     if (description) {
//       let meta = document.querySelector(
//         "meta[name='description']"
//       ) as HTMLMetaElement | null;
//       if (!meta) {
//         meta = document.createElement("meta");
//         meta.setAttribute("name", "description");
//         document.head.appendChild(meta);
//       }
//       meta.setAttribute("content", description.slice(0, 160));
//     }

//     // Canonical
//     if (canonicalPath) {
//       let link = document.querySelector(
//         "link[rel='canonical']"
//       ) as HTMLLinkElement | null;
//       if (!link) {
//         link = document.createElement("link");
//         link.setAttribute("rel", "canonical");
//         document.head.appendChild(link);
//       }
//       const origin = window.location.origin;
//       link.setAttribute("href", `${origin}${canonicalPath}`);
//     }

//     // JSON-LD structured data
//     const existing = document.getElementById("structured-data");
//     if (existing) existing.remove();
//     if (structuredData) {
//       const script = document.createElement("script");
//       script.type = "application/ld+json";
//       script.id = "structured-data";
//       script.text = JSON.stringify(structuredData);
//       document.head.appendChild(script);
//     }
//   }, [title, description, canonicalPath, structuredData]);

//   return null;
// };

// export default Seo;
import React, { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  structuredData?: object;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonicalPath,
  structuredData,
}) => {
  useEffect(() => {
    // Title
    document.title = title.length > 60 ? `${title.slice(0, 57)}...` : title;

    // Meta description
    if (description) {
      let meta = document.querySelector(
        "meta[name='description']"
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description.slice(0, 160));
    }

    // Canonical
    if (canonicalPath) {
      let link = document.querySelector(
        "link[rel='canonical']"
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      const origin = window.location.origin;
      link.setAttribute("href", `${origin}${canonicalPath}`);
    }

    // JSON-LD structured data
    const existing = document.getElementById("structured-data");
    if (existing) existing.remove();
    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "structured-data";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, structuredData]);

  return null;
};

export default Seo;

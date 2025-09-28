import { useEffect, useRef } from 'react';

interface RichContentRendererProps {
  content: string;
  className?: string;
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && content) {
      // Apply rich text styles to the container
      const container = containerRef.current;
      
      // Add classes for proper typography
      container.innerHTML = content;
      
      // Style headings
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        heading.classList.add('font-bold', 'text-foreground', 'mb-4', 'mt-8');
        if (heading.tagName === 'H1') {
          heading.classList.add('text-4xl', 'md:text-5xl', 'leading-tight');
        } else if (heading.tagName === 'H2') {
          heading.classList.add('text-3xl', 'md:text-4xl', 'leading-tight');
        } else if (heading.tagName === 'H3') {
          heading.classList.add('text-2xl', 'md:text-3xl');
        } else if (heading.tagName === 'H4') {
          heading.classList.add('text-xl', 'md:text-2xl');
        } else {
          heading.classList.add('text-lg', 'md:text-xl');
        }
      });
      
      // Style paragraphs
      const paragraphs = container.querySelectorAll('p');
      paragraphs.forEach((p) => {
        p.classList.add('mb-6', 'leading-relaxed', 'text-card-foreground', 'text-lg');
      });
      
      // Style lists
      const lists = container.querySelectorAll('ul, ol');
      lists.forEach((list) => {
        list.classList.add('mb-6', 'pl-6', 'space-y-2');
        if (list.tagName === 'UL') {
          list.classList.add('list-disc');
        } else {
          list.classList.add('list-decimal');
        }
      });
      
      // Style list items
      const listItems = container.querySelectorAll('li');
      listItems.forEach((li) => {
        li.classList.add('text-card-foreground', 'leading-relaxed');
      });
      
      // Style links
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        link.classList.add('text-primary', 'hover:text-primary/80', 'underline', 'transition-colors');
      });
      
      // Style strong/bold text
      const strongElements = container.querySelectorAll('strong, b');
      strongElements.forEach((strong) => {
        strong.classList.add('font-semibold', 'text-foreground');
      });
      
      // Style emphasis/italic text
      const emElements = container.querySelectorAll('em, i');
      emElements.forEach((em) => {
        em.classList.add('italic');
      });
      
      // Style images
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        img.classList.add('rounded-lg', 'shadow-lg', 'max-w-full', 'h-auto', 'cursor-pointer', 'hover:shadow-xl', 'transition-shadow');
        img.addEventListener('click', () => handleImageClick(img.src));
      });
      
      // Style blockquotes
      const blockquotes = container.querySelectorAll('blockquote');
      blockquotes.forEach((blockquote) => {
        blockquote.classList.add('border-l-4', 'border-primary', 'pl-6', 'italic', 'text-muted-foreground', 'mb-6', 'bg-muted/20', 'py-4', 'rounded-r-lg');
      });
    }
  }, [content]);

  const handleImageClick = (src: string) => {
    // Simple lightbox implementation
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
    lightbox.onclick = () => document.body.removeChild(lightbox);
    
    const img = document.createElement('img');
    img.src = src;
    img.className = 'max-w-[90vw] max-h-[90vh] object-contain rounded-lg';
    img.onclick = (e) => e.stopPropagation();
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.className = 'absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors';
    closeBtn.onclick = () => document.body.removeChild(lightbox);
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
  };

  if (!content) return null;

  return (
    <div 
      ref={containerRef}
      className={`prose prose-lg max-w-none ${className}`}
      style={{
        fontSize: '1.125rem',
        lineHeight: '1.7',
      }}
    />
  );
};

export default RichContentRenderer;
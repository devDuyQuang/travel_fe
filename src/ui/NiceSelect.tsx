'use client'
import React, { useState, useCallback, useRef, FC, useEffect } from "react";
import { useClickAway } from "react-use";

interface Option {
   value: string;
   text: string;
}

type NiceSelectProps = {
   options: Option[];
   defaultCurrent: number;
   placeholder: string;
   className?: string;
   onChange: (item: Option, name: string) => void;
   name: string;
}

const NiceSelect: FC<NiceSelectProps> = ({
   options,
   defaultCurrent,
   placeholder,
   className,
   onChange,
   name,
}) => {
   const [open, setOpen] = useState(false);
   const [current, setCurrent] = useState<Option>(options[defaultCurrent]);
   const onClose = useCallback(() => {
      setOpen(false);
   }, []);
   const ref = useRef<HTMLDivElement | null>(null);

   useClickAway(ref, onClose);

   useEffect(() => {
      const next = options[defaultCurrent];

      setCurrent((previous) =>
         previous?.value === next?.value ? previous : next,
      );
   }, [defaultCurrent, options]);

   const currentHandler = (item: Option) => {
      setCurrent(item);
      onChange(item, name);
      onClose();
   };

   return (
      <div
         className={`nice-select form-select-lg ${className || ""} ${open ? "open" : ""}`}
         role="button"
         tabIndex={0}
         onClick={() => setOpen((prev) => !prev)}
         onKeyDown={(e) => e}
         ref={ref}
      >
         <span className="current">{current?.text || placeholder}</span>
         <ul
            className="list"
            role="menubar"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
         >
            {options?.map((item) => (
               <li
                  key={item.value}
                  data-value={item.value}
                  className={`option ${item.value === current?.value ? "selected focus" : ""
                     }`}
                  style={{ fontSize: '14px' }}
                  role="menuitem"
                  onClick={() => currentHandler(item)}
                  onKeyDown={(e) => e}
               >
                  {item.text}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default NiceSelect;



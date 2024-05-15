import Image from "next/image";

interface ImgProps {
  className?: string;
  src: string;
  alt: string;
  priority?: boolean;
}

const Img = ({ className, src, alt, priority = false }: ImgProps) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        style={{
          objectFit: "cover",
          overflow: "hidden",
        }}
        src={src}
        alt={alt}
        fill={true}
        priority={priority}
        sizes="500px"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
      />
    </div>
  );
};

export default Img;

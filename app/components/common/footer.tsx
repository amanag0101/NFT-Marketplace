import Typography from "../ui/typography";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-100-light dark:bg-primary-100-dark text-center p-4">
      <Typography
        variant="p"
        text={`© ${year} NFT Marketplace. All rights reserved.`}
      />
      <Typography
        variant="p"
        text="NFT Marketplace™ and the NFT Marketplace Logo® are trademarks of NFT Marketplace,
        LLC."
      />
    </footer>
  );
};

export default Footer;

function Footer() {
  return (
    <footer className="py-8 text-center text-sm font-medium">
      <p>
        Copyright ⓒ {new Date().getFullYear()} team.config. All rights reserved.
        <br />
        Made by{' '}
        <a
          href="https://github.com/boostcampwm2025/web15-ipconfig"
          target="_blank"
          rel="noopener noreferrer"
        >
          IPConfig 팀
        </a>
      </p>
    </footer>
  );
}

export default Footer;

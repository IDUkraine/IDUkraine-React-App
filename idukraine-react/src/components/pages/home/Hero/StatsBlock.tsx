interface StatsBlockProps {
  title?: string;
  text?: string;
  isDark?: boolean;
  children?: React.ReactNode;
}

const StatsBlock = ({
  title,
  text,
  isDark = false,
  children,
}: StatsBlockProps) => {
  return (
    <div className={isDark ? 'stats-block stats-block-dark' : 'stats-block'}>
      {title && <span className="stats-number">{title}</span>}
      {text && <p className="stats-label">{text}</p>}
      {children}
    </div>
  );
};

export default StatsBlock;

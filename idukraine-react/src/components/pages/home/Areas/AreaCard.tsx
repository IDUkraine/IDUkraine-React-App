import '../../../../assets/styles/areas.css';
import RightArrowIcon from '../../../../assets/svgs/icons/arrow-right-alt.svg';

interface AreaCardProps {
  title: string;
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClass: string;
  isSelected: boolean;
  onArrowClick: () => void;
  children?: React.ReactNode;
}

const AreaCard = ({
  title,
  text,
  icon: Icon,
  iconClass,
  isSelected,
  onArrowClick,
  children,
}: AreaCardProps) => {
  return (
    <div
      className={`area-card ${isSelected ? 'area-card-selected' : ''}`}
      onClick={onArrowClick}
    >
      <Icon className={`area-card-icon ${iconClass}`} />
      <div className="area-card-content-container">
        <div className="area-card-content">
          <h3 className="area-card-title">{title}</h3>
          <p className="area-card-text">{text}</p>
        </div>
        {<RightArrowIcon className="area-card-arrow" />}
      </div>
      {children}
    </div>
  );
};

export default AreaCard;

import '../../../../assets/styles/areas.css';
import RightArrowIcon from '../../../../assets/svgs/arrow-right-alt.svg';

interface AreaCardProps {
  title: string;
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isSelected: boolean; // Whether this card is selected
  onArrowClick: () => void; // Callback for arrow click
  children?: React.ReactNode;
}

const AreaCard = ({
  title,
  text,
  icon: Icon,
  isSelected,
  onArrowClick,
  children,
}: AreaCardProps) => {
  return (
    <div
      className={`area-card ${isSelected ? 'area-card-selected' : ''}`}
      onClick={onArrowClick}
    >
      <Icon className="card-icon" />
      <div className="card-content-container">
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-text">{text}</p>
        </div>
        <RightArrowIcon className="card-arrow" />
      </div>
      {children}
    </div>
  );
};

export default AreaCard;

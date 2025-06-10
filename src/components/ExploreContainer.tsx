import './ExploreContainer.css';
import { decrement, incrementAsync } from '../store/slices/counterSlice';
import { IonButton } from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const { value, value2 } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <div className="container">
      <strong>{name}</strong>
      <h2>{value}</h2>
      <h2>{value2}</h2>
      <div>
        <IonButton onClick={() => dispatch(incrementAsync(10))}>Increment</IonButton>
        <IonButton onClick={() => dispatch(decrement())}>Deccrement</IonButton>
      </div>
    </div>
  );
};

export default ExploreContainer;

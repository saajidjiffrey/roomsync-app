import React, { useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonChip,
  IonCol,
  IonRow,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchExpenseById, selectCurrentExpense, selectExpenseIsLoading } from '../../../store/slices/expenseSlice';
import { fetchSplitsByExpense, selectSplitsByExpense, selectSplitIsLoading } from '../../../store/slices/splitSlice';
import { formatAmount } from '../../../utils';
import { format } from 'date-fns';

const ExpenseDetail: React.FC = () => {
  const { expenseId } = useParams<{ expenseId: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  
  const expense = useAppSelector(selectCurrentExpense);
  const expenseLoading = useAppSelector(selectExpenseIsLoading);
  const splits = useAppSelector(selectSplitsByExpense);
  const splitsLoading = useAppSelector(selectSplitIsLoading);

  useEffect(() => {
    if (expenseId) {
      dispatch(fetchExpenseById(parseInt(expenseId)));
      dispatch(fetchSplitsByExpense(parseInt(expenseId)));
    }
  }, [dispatch, expenseId]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'unpaid': return 'danger';
      default: return 'medium';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'unpaid': return 'Unpaid';
      default: return status;
    }
  };

  const calculateSplitTotal = () => {
    return splits.reduce((total, split) => total + parseFloat(String(split.split_amount || 0)), 0);
  };

  const calculatePaidTotal = () => {
    return splits
      .filter(split => split.status === 'paid')
      .reduce((total, split) => total + parseFloat(String(split.split_amount || 0)), 0);
  };

  const calculateRemaining = () => {
    return parseFloat(String(expense?.receipt_total || 0)) - calculatePaidTotal();
  };

  if (expenseLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Expense Detail</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className='ion-padding'>
            <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
            <IonSkeletonText animated style={{ width: '80%', height: '2rem' }} />
            <IonSkeletonText animated style={{ width: '40%', height: '1rem' }} />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!expense) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Expense Detail</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className='ion-padding ion-text-center'>
            <IonText>
              <h2>Expense not found</h2>
              <p>The expense you're looking for doesn't exist or you don't have access to it.</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Expense Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='ion-padding'>
          <IonChip color="primary">
            <IonLabel>{expense.category}</IonLabel>
          </IonChip>
          <h1>{expense.title}</h1>
          <p className='mb-0'>{format(new Date(expense.created_at), 'dd MMM, yyyy')}</p>
          <p className='mb-0'>Created by: {expense.Tenant?.User?.full_name || 'Unknown'}</p>
          {expense.description && (
            <p className='mt-3 mb-0'>{expense.description}</p>
          )}
        </div>

        <div className='ion-padding ion-margin bg-light rounded-2'>
          <div className='d-flex justify-content-between align-items-center'>
            <IonLabel>Receipt Total</IonLabel>
            <IonLabel>LKR {formatAmount(expense.receipt_total)}</IonLabel>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <IonLabel>Split Total</IonLabel>
            <IonLabel>LKR {formatAmount(calculateSplitTotal())}</IonLabel>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <IonLabel className='fw-bold text-danger'>Remaining</IonLabel>
            <IonLabel className='fw-bold text-danger'>LKR {formatAmount(calculateRemaining())}</IonLabel>
          </div>
        </div>

        <IonList lines='inset'>
          <IonListHeader>
            <IonLabel>Split With</IonLabel>
          </IonListHeader>

          {splitsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <IonItem key={index}>
                <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
              </IonItem>
            ))
          ) : splits.length === 0 ? (
            <IonItem>
              <IonLabel className="ion-text-center">
                <h3>No splits found</h3>
                <p>This expense doesn't have any splits yet.</p>
              </IonLabel>
            </IonItem>
          ) : (
            splits.map((split) => (
              <IonItem key={split.id}>
                <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
                  <img alt="" src="/images/user_placeholder.jpg" />
                </IonAvatar>
                <IonLabel className='ion-align-self-start'>
                  <strong>{split.assignedTenant?.User?.full_name || 'Unknown User'}</strong>
                  <p>LKR {formatAmount(split.split_amount)}</p>
                </IonLabel>
                <IonChip color={getStatusColor(split.status)} slot="end">
                  <IonLabel>{getStatusText(split.status)}</IonLabel>
                </IonChip>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ExpenseDetail;
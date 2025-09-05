import React, { useEffect } from 'react';
import { 
  IonPage, 
  IonContent,
  IonLabel,
  IonListHeader,
  IonList,
  IonItemGroup,
  IonButton,
  IonText,
  IonItem,
  IonAvatar,
  IonChip,
  IonSkeletonText
} from '@ionic/react';
import './TenantHome.css';
import ExpenseCard from '../../components/expense/ExpenseCard';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchExpensesByGroup, selectExpenses, selectExpenseIsLoading } from '../../store/slices/expenseSlice';
import { fetchSplitSummary, selectSplitSummary, selectSplitIsLoading } from '../../store/slices/splitSlice';

const TenantHome: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const dispatch = useAppDispatch();
  
  const propertyId = user?.tenant_profile?.property_id;
  const groupId = user?.tenant_profile?.group_id;

  // Redux selectors
  const expenses = useAppSelector(selectExpenses);
  const expensesLoading = useAppSelector(selectExpenseIsLoading);
  const splitSummary = useAppSelector(selectSplitSummary);
  const splitLoading = useAppSelector(selectSplitIsLoading);

  // Fetch data when component mounts and user has a group
  useEffect(() => {
    if (groupId) {
      dispatch(fetchExpensesByGroup(groupId));
      dispatch(fetchSplitSummary());
    }
  }, [dispatch, groupId]);

  // Calculate monthly total group expenses (current month)
  const getMonthlyTotalExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.created_at);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + parseFloat(expense.receipt_total || 0), 0);
  };

  // Get recent 10 expenses
  const recentExpenses = expenses.slice(0, 10);

  // If no property, show join property message
  if (!propertyId) {
    return (
      <IonPage>
        <PageHeader title="Home" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a property</h2>
              <p>You need to join a property to access group features.</p>
            </IonText>
            <IonButton 
              expand="block" 
              onClick={() => history.push('/tenant/find-property')}
              className="ion-margin-top"
            >
              Find Property
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // If no group, show join group message
  if (!groupId) {
    return (
      <IonPage>
        <PageHeader title="Home" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a group</h2>
              <p>You need to join a group to access expense and task features.</p>
            </IonText>
            <IonButton 
              expand="block" 
              onClick={() => history.push('/tenant/select-group')}
              className="ion-margin-top"
            >
              Select Group
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // If both property and group exist, show normal home content
  return (
    <IonPage>
      <PageHeader title="Home" />

      <IonContent fullscreen>
        {/* Group Information */}
        <div className="p-3">
          <div className="row g-2">
            <div className="col-12">
              <div className="card p-3 bg-primary text-white">
                <IonLabel className="d-block mb-2">Monthly Total Group Expenses</IonLabel>
                {expensesLoading ? (
                  <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
                ) : (
                  <h2 className="mb-0">LKR {getMonthlyTotalExpenses().toFixed(2)}</h2>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="card p-3 bg-success text-white">
                <IonLabel className="d-block mb-2">To be received</IonLabel>
                {splitLoading ? (
                  <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
                ) : (
                  <h2 className="mb-0">LKR {parseFloat(splitSummary?.toReceive?.total || 0).toFixed(2)}</h2>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="card p-3 bg-warning text-dark">
                <IonLabel className="d-block mb-2">To be paid</IonLabel>
                {splitLoading ? (
                  <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
                ) : (
                  <h2 className="mb-0">LKR {parseFloat(splitSummary?.toPay?.total || 0).toFixed(2)}</h2>
                )}
              </div>
            </div>
          </div>
        </div>

        <IonList lines='full' inset>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel className='ion-no-margin'>Recent Expenses</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            {expensesLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <IonItem key={index}>
                  <IonAvatar slot="start">
                    <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                  </IonAvatar>
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: '80%', height: '1rem' }} />
                    <IonSkeletonText animated style={{ width: '60%', height: '0.8rem' }} />
                    <IonSkeletonText animated style={{ width: '40%', height: '0.8rem' }} />
                  </IonLabel>
                  <IonSkeletonText animated style={{ width: '60px', height: '1.5rem' }} slot="end" />
                </IonItem>
              ))
            ) : recentExpenses.length === 0 ? (
              <IonItem>
                <IonLabel>
                  <h2>No expenses yet</h2>
                  <p>Create your first expense to get started!</p>
                </IonLabel>
              </IonItem>
            ) : (
              recentExpenses.map((expense) => (
                <IonItem key={expense.id} button>
                  <IonAvatar slot="start">
                    <img src="/images/user_placeholder.jpg" alt="" />
                  </IonAvatar>
                  <IonLabel>
                    <h2>{expense.title}</h2>
                    <p>Category: {expense.category}</p>
                    <p>Date: {new Date(expense.created_at).toLocaleDateString()}</p>
                  </IonLabel>
                  <IonChip color="primary" slot="end">
                    LKR {parseFloat(expense.receipt_total || 0).toFixed(2)}
                  </IonChip>
                </IonItem>
              ))
            )}
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TenantHome;
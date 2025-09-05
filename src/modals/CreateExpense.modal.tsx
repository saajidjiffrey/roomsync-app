import React, { useRef, useState, useEffect } from 'react';
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonInput,
  IonList,
  IonListHeader,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonAvatar,
  IonText,
  IonSkeletonText
} from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createExpense } from '../store/slices/expenseSlice';
import { fetchToPaySplits, fetchToReceiveSplits, fetchSplitHistory, fetchSplitSummary } from '../store/slices/splitSlice';
import { fetchMyGroups } from '../store/slices/groupSlice';
import { selectMyGroups } from '../store/slices/groupSlice';
import { ExpenseCategory } from '../types/expense';
import { GroupMember } from '../types/group';

const CreateExpenseModal = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const myGroups = useAppSelector(selectMyGroups);
  
  // Form refs
  const categoryRef = useRef<HTMLIonSelectElement>(null);
  const titleRef = useRef<HTMLIonInputElement>(null);
  const descriptionRef = useRef<HTMLIonTextareaElement>(null);
  const amountRef = useRef<HTMLIonInputElement>(null);
  
  // State
  const [selectedRoommates, setSelectedRoommates] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  
  const groupId = user?.tenant_profile?.group_id;
  const currentUserTenantId = user?.tenant_profile?.id;

  // Expense categories
  const expenseCategories: ExpenseCategory[] = ['groceries', 'dinner', 'breakfast', 'lunch', 'other'];

  // Load group members when component mounts
  useEffect(() => {
    const loadGroupMembers = async () => {
      if (groupId && currentUserTenantId) {
        // Fetch user's groups to get the current group with members
        await dispatch(fetchMyGroups());
      }
    };
    loadGroupMembers();
  }, [dispatch, groupId, currentUserTenantId]);

  // Update group members when myGroups data changes
  useEffect(() => {
    console.log('myGroups updated:', myGroups);
    console.log('groupId:', groupId);
    console.log('currentUserTenantId:', currentUserTenantId);
    
    if (groupId && myGroups.length > 0) {
      // Find the current group from my groups
      const currentGroup = myGroups.find(group => group.id === groupId);
      console.log('currentGroup found:', currentGroup);
      
      if (currentGroup && currentGroup.members) {
        console.log('Setting group members:', currentGroup.members);
        setGroupMembers(currentGroup.members);
        // Auto-select the current user
        if (currentUserTenantId) {
          setSelectedRoommates([currentUserTenantId]);
        }
      }
    }
  }, [groupId, myGroups, currentUserTenantId]);

  const handleRoommateToggle = (tenantId: number) => {
    setSelectedRoommates(prev => {
      if (prev.includes(tenantId)) {
        // Don't allow deselecting the current user
        if (tenantId === currentUserTenantId) {
          return prev;
        }
        return prev.filter(id => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
  };

  const handleSelectAll = () => {
    if (groupMembers.length > 0) {
      setSelectedRoommates(groupMembers.map(member => member.id));
    }
  };

  const handleCreateExpense = async () => {
    if (!groupId || !currentUserTenantId) {
      console.error('Missing group ID or user tenant ID');
      return;
    }

    const category = categoryRef.current?.value;
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const amount = amountRef.current?.value;

    if (!category || !title || !amount) {
      console.error('Missing required fields');
      return;
    }

    if (selectedRoommates.length === 0) {
      console.error('No roommates selected');
      return;
    }

    setIsCreating(true);
    try {
      await dispatch(createExpense({
        title: title.toString(),
        description: description?.toString(),
        receipt_total: parseFloat(amount.toString()),
        category: category as ExpenseCategory,
        group_id: groupId,
        selected_roommates: selectedRoommates
      }));

      // Refresh split data after creating expense
      await Promise.all([
        dispatch(fetchToPaySplits()),
        dispatch(fetchToReceiveSplits()),
        dispatch(fetchSplitHistory()),
        dispatch(fetchSplitSummary())
      ]);

      dismiss(title, 'confirm');
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Create Expense</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={handleCreateExpense} 
              strong={true}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList mode='ios' lines='inset' inset className='input-wrapper'>
          <IonListHeader>
            <IonLabel className='ion-no-margin'>Expense Details</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonSelect 
              ref={categoryRef}
              label="Select Category" 
              interface="action-sheet" 
              labelPlacement="floating" 
              placeholder="Select Category"
            >
              {expenseCategories.map(category => (
                <IonSelectOption key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput 
              ref={titleRef}
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Expense Title" 
              placeholder="Enter Expense Title"
              required
            />
          </IonItem>

          <IonItem>
            <IonTextarea 
              ref={descriptionRef}
              labelPlacement="stacked" 
              mode='md' 
              rows={3}
              label="Description" 
              placeholder="Enter Expense Description (Optional)"
            />
          </IonItem>
          
          <IonItem>
            <IonInput 
              ref={amountRef}
              labelPlacement="stacked" 
              mode='md' 
              type='number' 
              label="Receipt Amount (LKR)" 
              placeholder="Enter Receipt Amount"
              required
            />
          </IonItem>
        </IonList>

        <IonList mode='ios' lines='inset' inset className='input-wrapper'>
          <IonListHeader>
            <IonLabel className='ion-no-margin'>Select Roommates</IonLabel>
            <IonButton 
              fill="clear" 
              size="small"
              onClick={handleSelectAll}
            >
              Select All
            </IonButton>
          </IonListHeader>
          
          {groupMembers.length === 0 ? (
            <IonItem>
              <IonSkeletonText animated style={{ width: '100%', height: '3rem' }} />
            </IonItem>
          ) : (
            groupMembers.map((member) => (
              <IonItem key={member.id}>
                <IonAvatar slot="start">
                  <img src="/images/user_placeholder.jpg" alt="" />
                </IonAvatar>
                <IonLabel>
                  <h2>{member.tenantUser?.full_name || 'Unknown User'}</h2>
                  <p>{member.tenantUser?.email}</p>
                </IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={selectedRoommates.includes(member.id)}
                  onIonChange={() => handleRoommateToggle(member.id)}
                  disabled={member.id === currentUserTenantId} // Current user is always selected
                />
              </IonItem>
            ))
          )}
        </IonList>

        {selectedRoommates.length > 0 && amountRef.current?.value && (
          <div className="ion-padding">
            <IonText color="primary">
              <h3>Split Summary</h3>
              <p>
                Total: LKR {amountRef.current.value}<br/>
                Per person: LKR {(parseFloat(amountRef.current.value.toString()) / selectedRoommates.length).toFixed(2)}<br/>
                Split between {selectedRoommates.length} people
              </p>
            </IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CreateExpenseModal;
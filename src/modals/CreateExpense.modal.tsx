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
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonChip
} from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createExpense } from '../store/slices/expenseSlice';
import { fetchToPaySplits, fetchToReceiveSplits, fetchSplitHistory, fetchSplitSummary } from '../store/slices/splitSlice';
import { fetchMyGroups } from '../store/slices/groupSlice';
import { selectMyGroups } from '../store/slices/groupSlice';
import { ExpenseCategory } from '../types/expense';
import { GroupMember } from '../types/group';

interface FormErrors {
  category?: string;
  title?: string;
  amount?: string;
  roommates?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    amount: ''
  });
  
  const groupId = user?.tenant_profile?.group_id;
  const currentUserTenantId = user?.tenant_profile?.id;

  // Expense categories
  const expenseCategories: ExpenseCategory[] = ['groceries', 'dinner', 'breakfast', 'lunch', 'other'];

  // Input change handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Category validation
    if (!formData.category.trim()) {
      newErrors.category = 'Please select a category';
    }
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Expense title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount.trim());
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount greater than 0';
      }
    }
    
    // Roommates validation
    if (selectedRoommates.length === 0) {
      newErrors.roommates = 'Please select at least one roommate';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    try {
      await dispatch(createExpense({
        title: formData.title.trim(),
        description: formData.description.trim(),
        receipt_total: parseFloat(formData.amount.trim()),
        category: formData.category as ExpenseCategory,
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

      dismiss(formData.title, 'confirm');
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
              value={formData.category}
              onIonChange={(e) => handleInputChange('category', e.detail.value)}
              color={errors.category ? 'danger' : undefined}
            >
              {expenseCategories.map(category => (
                <IonSelectOption key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          {errors.category && (
            <IonText color="danger" className="ion-padding-start">
              <p style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.category}</p>
            </IonText>
          )}

          <IonItem>
            <IonInput 
              ref={titleRef}
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Expense Title" 
              placeholder="Enter Expense Title"
              value={formData.title}
              onIonInput={(e) => handleInputChange('title', e.detail.value!)}
              color={errors.title ? 'danger' : undefined}
              required
            />
          </IonItem>
          {errors.title && (
            <IonText color="danger" className="ion-padding-start">
              <p style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.title}</p>
            </IonText>
          )}

          <IonItem>
            <IonTextarea 
              ref={descriptionRef}
              labelPlacement="stacked" 
              mode='md' 
              rows={3}
              label="Description" 
              placeholder="Enter Expense Description"
              value={formData.description}
              onIonInput={(e) => handleInputChange('description', e.detail.value!)}
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
              value={formData.amount}
              onIonInput={(e) => handleInputChange('amount', e.detail.value!)}
              color={errors.amount ? 'danger' : undefined}
              required
            />
          </IonItem>
          {errors.amount && (
            <IonText color="danger" className="ion-padding-start">
              <p style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.amount}</p>
            </IonText>
          )}
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
          {errors.roommates && (
            <IonText color="danger" className="ion-padding-start">
              <p style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.roommates}</p>
            </IonText>
          )}
          
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
                  <h2>{member.User?.full_name || 'Unknown User'}</h2>
                  <p>{member.User?.email}</p>
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

        {selectedRoommates.length > 0 && formData.amount && (
          <IonCard className="ion-margin">
            <IonCardContent>
              <div className="ion-text-center ion-margin-bottom">
                <IonText color="primary">
                  <h3>Split Summary</h3>
                </IonText>
              </div>
              
              <div className="ion-padding-horizontal">
                <div className="d-flex justify-content-between align-items-center ion-margin-bottom">
                  <IonText>
                    <p><strong>Total Amount</strong></p>
                  </IonText>
                  <IonText color="primary">
                    <p><strong>LKR {parseFloat(formData.amount).toFixed(2)}</strong></p>
                  </IonText>
                </div>
                
                <div className="d-flex justify-content-between align-items-center ion-margin-bottom">
                  <IonText>
                    <p><strong>Per Person</strong></p>
                  </IonText>
                  <IonText color="success">
                    <p><strong>LKR {(parseFloat(formData.amount) / selectedRoommates.length).toFixed(2)}</strong></p>
                  </IonText>
                </div>
                
                <div className="d-flex justify-content-between align-items-center ion-margin-bottom">
                  <IonText>
                    <p><strong>Split Between</strong></p>
                  </IonText>
                  <IonChip color="medium">
                    <IonLabel>{selectedRoommates.length} {selectedRoommates.length === 1 ? 'person' : 'people'}</IonLabel>
                  </IonChip>
                </div>
                
                <div className="ion-margin-top">
                  <IonText color="medium">
                    <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                      Selected roommates will be notified about this expense
                    </p>
                  </IonText>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CreateExpenseModal;
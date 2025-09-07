import React, { useState, useEffect } from 'react';
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
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonAvatar,
  IonText,
  IonSkeletonText,
  IonCheckbox
} from '@ionic/react';
import './CreateTask.modal.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTask } from '../store/slices/taskSlice';
import { fetchMyGroups, selectMyGroups } from '../store/slices/groupSlice';
import { GroupMember } from '../types/group';
import { CreateTaskRequest } from '../types/task';
import { useAuth } from '../hooks/useAuth';

interface FormErrors {
  title?: string;
  priority?: string;
  assigned_to?: string;
}

const CreateTaskModal = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const myGroups = useAppSelector(selectMyGroups);
  
  // State
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    due_date: '',
    assigned_to: ''
  });
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  

  // Load groups and current user's group members when component mounts
  useEffect(() => {
    if (myGroups.length === 0) {
      dispatch(fetchMyGroups());
    }
  }, [dispatch, myGroups.length]);

  // Load current user's group members
  useEffect(() => {
    if (user?.tenant_profile?.group_id && myGroups.length > 0) {
      setIsLoadingMembers(true);
      const currentUserGroup = myGroups.find(group => group.id === user.tenant_profile?.group_id);
      if (currentUserGroup?.members) {
        setGroupMembers(currentUserGroup.members);
      }
      setIsLoadingMembers(false);
    }
  }, [user?.tenant_profile?.group_id, myGroups]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Task title must be at least 2 characters';
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    if (!formData.assigned_to) {
      newErrors.assigned_to = 'Assignee is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      const taskData: CreateTaskRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority as 'low' | 'medium' | 'high',
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
        assigned_to: parseInt(formData.assigned_to),
        group_id: user?.tenant_profile?.group_id || 0
      };

      await dispatch(createTask(taskData)).unwrap();
      dismiss('Task created successfully', 'confirm');
    } catch (error: unknown) {
      console.error('Error creating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      alert(errorMessage);
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
          <IonTitle>Create Task</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit} strong={true} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          {/* Title */}
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Task Title" 
              placeholder="Enter task title"
              value={formData.title}
              onIonInput={(e) => handleInputChange('title', e.detail.value!)}
              className={errors.title ? 'ion-invalid' : ''}
            />
          </IonItem>
          {errors.title && (
            <IonText color="danger" className="ion-padding-start">
              <small>{errors.title}</small>
            </IonText>
          )}

          {/* Description */}
          <IonItem>
            <IonTextarea 
              label="Description" 
              labelPlacement="stacked" 
              rows={3}
              placeholder="Enter task description (optional)"
              value={formData.description}
              onIonInput={(e) => handleInputChange('description', e.detail.value!)}
            />
          </IonItem>

          {/* Priority */}
          <IonItem>
            <IonSelect
              value={formData.priority}
              onIonChange={(e) => handleInputChange('priority', e.detail.value)}
              label="Priority"
              labelPlacement="stacked"
              interface="action-sheet"
              placeholder="Select priority"
              className={errors.priority ? 'ion-invalid' : ''}
            >
              <IonSelectOption value="low">Low Priority</IonSelectOption>
              <IonSelectOption value="medium">Medium Priority</IonSelectOption>
              <IonSelectOption value="high">High Priority</IonSelectOption>
            </IonSelect>
          </IonItem>
          {errors.priority && (
            <IonText color="danger" className="ion-padding-start">
              <small>{errors.priority}</small>
            </IonText>
          )}

          {/* Due Date */}
          <IonItem>
            <IonLabel>Due Date (Optional)</IonLabel>
            <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

            
          </IonItem>
        </IonList>

        {/* Assignee Selection */}
        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel className='ion-no-margin'>Assign To</IonLabel>
          </IonListHeader>
          
          {isLoadingMembers ? (
            <IonItem>
              <IonSkeletonText animated style={{ width: '100%', height: '3rem' }} />
            </IonItem>
          ) : groupMembers.length === 0 ? (
            <IonItem>
              <IonText color="medium">
                <p>No members found in your group.</p>
              </IonText>
            </IonItem>
          ) : (
            groupMembers.map((member) => (
              <IonItem key={member.id}>
                <IonAvatar slot="start">
                  <img src={member.User?.profile_url || "/images/user_placeholder.jpg"} alt="" />
                </IonAvatar>
                <IonLabel>
                  <h2>{member.User?.full_name || 'Unknown User'}</h2>
                  <p>{member.User?.email}</p>
                </IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={formData.assigned_to === member.id.toString()}
                  onIonChange={() => handleInputChange('assigned_to', member.id.toString())}
                />
              </IonItem>
            ))
          )}
        </IonList>
        {errors.assigned_to && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.assigned_to}</small>
          </IonText>
        )}

        {/* Due Date Modal */}
        <IonModal keepContentsMounted={true}>
          <IonDatetime
            id="datetime"
            presentation="date"
            value={formData.due_date}
            onIonChange={(e) => handleInputChange('due_date', e.detail.value as string)}
            formatOptions={{
              date: {
                weekday: 'short',
                month: 'long',
                day: '2-digit',
              }
            }}
          ></IonDatetime>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CreateTaskModal;

import React, { useEffect, useState } from 'react';
import { 
  IonPage, 
  IonContent,
  IonLabel,
  IonListHeader,
  IonList,
  IonItemGroup,
  IonSegmentButton,
  IonSegment,
  IonSegmentContent,
  IonSegmentView,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonModal,
  IonButton,
  IonText,
  IonItem,
  IonAvatar,
  IonChip,
  IonSkeletonText,
  IonSelect,
  IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  useIonActionSheet
} from '@ionic/react';
import './Tasks.page.css';
import { add, checkmarkCircle, time, alertCircle, trash } from 'ionicons/icons';
import { CreateTaskModal } from '../../../modals';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useAuth } from '../../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchTasksByGroup,
  fetchTaskStatistics,
  updateTaskStatus,
  deleteTask,
  selectCompletedTasks,
  selectIncompleteTasks,
  selectTaskStatistics,
  selectTaskIsLoading
} from '../../../store/slices/taskSlice';
import { Task } from '../../../types/task';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [present, dismiss] = useIonModal(CreateTaskModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });
  const [presentActionSheet] = useIonActionSheet();
  
  const propertyId = user?.tenant_profile?.property_id;
  const groupId = user?.tenant_profile?.group_id;
  const tenantId = user?.tenant_profile?.id;
  
  // Task data
  const completedTasks = useAppSelector(selectCompletedTasks);
  const incompleteTasks = useAppSelector(selectIncompleteTasks);
  const statistics = useAppSelector(selectTaskStatistics);
  const isLoading = useAppSelector(selectTaskIsLoading);

  // Local state
  const [selectedSegment, setSelectedSegment] = useState<'incomplete' | 'completed'>('incomplete');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return alertCircle;
      case 'medium': return time;
      case 'low': return checkmarkCircle;
      default: return time;
    }
  };

  const handleTaskStatusToggle = async (taskId: number, currentStatus: boolean) => {
    const header = currentStatus ? 'Mark as Incomplete' : 'Complete Task';
    const subHeader = currentStatus 
      ? 'Are you sure you want to mark this task as incomplete?' 
      : 'Are you sure you want to mark this task as completed?';

    presentActionSheet({
      header,
      subHeader,
      buttons: [
        {
          text: currentStatus ? 'Mark Incomplete' : 'Complete',
          role: currentStatus ? 'default' : 'destructive',
          handler: async () => {
            await dispatch(updateTaskStatus({ taskId, isCompleted: !currentStatus }));
            if (groupId) {
              dispatch(fetchTasksByGroup({ groupId }));
              dispatch(fetchTaskStatistics(groupId));
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    presentActionSheet({
      header: 'Delete Task',
      subHeader: 'Are you sure you want to delete this task? This action cannot be undone.',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await dispatch(deleteTask(taskId));
            if (groupId) {
              dispatch(fetchTasksByGroup({ groupId }));
              dispatch(fetchTaskStatistics(groupId));
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
  };

  const handleRefresh = async (event: CustomEvent) => {
    try {
      if (groupId) {
        await Promise.all([
          dispatch(fetchTasksByGroup({ groupId })),
          dispatch(fetchTaskStatistics(groupId))
        ]);
      }
    } finally {
      event.detail.complete();
    }
  };

  const openModal = () => {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        if (event.detail.role === 'confirm') {
          if (groupId) {
            dispatch(fetchTasksByGroup({ groupId }));
            dispatch(fetchTaskStatistics(groupId));
          }
        }
      },
    });
  };

  // Filter tasks based on priority
  const getFilteredTasks = (taskList: Task[]) => {
    if (priorityFilter === 'all') return taskList;
    return taskList.filter(task => task.priority === priorityFilter);
  };

  // Fetch task data when component mounts and user has a group
  useEffect(() => {
    if (groupId) {
      console.log('Fetching task data for groupId:', groupId);
      dispatch(fetchTasksByGroup({ groupId }));
      dispatch(fetchTaskStatistics(groupId));
    }
  }, [dispatch, groupId]);

  // If no property, show join property message
  if (!propertyId) {
    return (
      <IonPage>
        <PageHeader title="Tasks" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a property</h2>
              <p>You need to join a property to access task features.</p>
            </IonText>
            <div className="ion-margin-top">
              <IonButton 
                expand="block" 
                onClick={() => history.push('/tenant/find-property')}
                className="ion-margin-bottom"
              >
                Find Property
              </IonButton>
              <IonButton 
                expand="block" 
                fill="outline"
                onClick={() => history.push('/tenant/my-requests')}
              >
                View My Requests
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // If no group, show join group message
  if (!groupId) {
    return (
      <IonPage>
        <PageHeader title="Tasks" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a group</h2>
              <p>You need to join a group to access task features.</p>
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

  const filteredIncompleteTasks = getFilteredTasks(incompleteTasks);
  const filteredCompletedTasks = getFilteredTasks(completedTasks);

  // If both property and group exist, show normal tasks content
  return (
    <IonPage>
      <PageHeader title="Tasks" />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {/* Task Statistics Cards */}
        {statistics && (
          <div className="p-3">
            <div className="row g-2">
              <div className="col-4">
                <div className="card p-1 bg-primary text-white text-center">
                  <IonLabel className="d-block mb-2">Total</IonLabel>
                  <h4 className="mb-0">{statistics.total}</h4>
                </div>
              </div>
              <div className="col-4">
                <div className="card p-1 bg-success text-white text-center">
                  <IonLabel className="d-block mb-2">Completed</IonLabel>
                  <h4 className="mb-0">{statistics.completed}</h4>
                </div>
              </div>
              <div className="col-4">
                <div className="card p-1 bg-warning text-dark text-center">
                  <IonLabel className="d-block mb-2">Pending</IonLabel>
                  <h4 className="mb-0">{statistics.pending}</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Priority Filter */}
        <IonList mode='ios' lines='inset' inset className='input-wrapper ion-margin-horizontal'>
          <IonItem>
            <IonSelect
              value={priorityFilter}
              onIonChange={(e) => setPriorityFilter(e.detail.value)}
              label="Filter by Priority"
              labelPlacement="floating"
              interface="action-sheet"
              placeholder="All Priorities"
            >
              <IonSelectOption value="all">All Priorities</IonSelectOption>
              <IonSelectOption value="high">High Priority</IonSelectOption>
              <IonSelectOption value="medium">Medium Priority</IonSelectOption>
              <IonSelectOption value="low">Low Priority</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        <IonSegment className='ion-padding-start ion-padding-end' mode='md' value={selectedSegment}>
          <IonSegmentButton value="incomplete" contentId="incomplete" onClick={() => setSelectedSegment('incomplete')}>
            <IonLabel>Incomplete</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="completed" contentId="completed" onClick={() => setSelectedSegment('completed')}>
            <IonLabel>Completed</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        
        <IonSegmentView>
          <IonSegmentContent id="incomplete">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>Incomplete Tasks</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <IonItem key={index}>
                      <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
                    </IonItem>
                  ))
                ) : filteredIncompleteTasks.length === 0 ? (
                  <IonItem>
                    <IonLabel className="ion-text-center">
                      <h3>No incomplete tasks</h3>
                      <p>All tasks are completed!</p>
                    </IonLabel>
                  </IonItem>
                ) : (
                  filteredIncompleteTasks.map((task) => (
                    <IonItem key={task.id}>
                      <IonAvatar slot="start">
                        <img src={task.assignedTenant?.User?.profile_url || "/images/user_placeholder.jpg"} alt="" />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{task.title}</h2>
                        <p>Assigned to: {task.assignedTenant?.User?.full_name}</p>
                        <p>Created by: {task.createdByTenant?.User?.full_name}</p>
                        {task.due_date && (
                          <p className={isOverdue(task.due_date) ? 'text-danger' : ''}>
                            Due: {formatDate(task.due_date)}
                            {isOverdue(task.due_date) && ' (Overdue)'}
                          </p>
                        )}
                      </IonLabel>
                      <div slot="end" className="ion-text-end">
                        <IonChip className="mb-1" color={getPriorityColor(task.priority)}>
                          <IonIcon className='me-1' icon={getPriorityIcon(task.priority)} />
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </IonChip>
                        <div className="d-flex gap-2 justify-content-end">
                          {task.assigned_to === tenantId && (
                            <IonButton 
                              size="small" 
                              color="success" 
                              onClick={() => handleTaskStatusToggle(task.id, task.is_completed)}
                            >
                              <IonIcon icon={checkmarkCircle} />
                            </IonButton>
                          )}
                          {task.created_by === tenantId && task.assigned_to !== tenantId && (
                            <IonButton 
                              size="small" 
                              color="danger" 
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <IonIcon icon={trash} />
                            </IonButton>
                          )}
                        </div>
                      </div>
                    </IonItem>
                  ))
                )}
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
          
          <IonSegmentContent id="completed">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>Completed Tasks</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <IonItem key={index}>
                      <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
                    </IonItem>
                  ))
                ) : filteredCompletedTasks.length === 0 ? (
                  <IonItem>
                    <IonLabel className="ion-text-center">
                      <h3>No completed tasks</h3>
                      <p>Complete some tasks to see them here</p>
                    </IonLabel>
                  </IonItem>
                ) : (
                  filteredCompletedTasks.map((task) => (
                    <IonItem key={task.id}>
                      <IonAvatar slot="start">
                        <img src={task.assignedTenant?.User?.profile_url || "/images/user_placeholder.jpg"} alt="" />
                      </IonAvatar>
                      <IonLabel>
                        <h2 className="completed-task-title">{task.title}</h2>
                        <p>Assigned to: {task.assignedTenant?.User?.full_name}</p>
                        <p>Created by: {task.createdByTenant?.User?.full_name}</p>
                        {task.due_date && (
                          <p>Due: {formatDate(task.due_date)}</p>
                        )}
                      </IonLabel>
                      <div slot="end" className="ion-text-end">
                        <IonChip className="mb-1" color={getPriorityColor(task.priority)}>
                          <IonIcon className='me-1' icon={getPriorityIcon(task.priority)} />
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </IonChip>
                        <div className='d-flex gap-2 justify-content-end'>
                          {task.created_by === tenantId && task.assigned_to !== tenantId && (
                            <IonButton 
                              size="small" 
                              color="danger" 
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <IonIcon icon={trash} />
                            </IonButton>
                          )}
                        </div>
                      </div>
                    </IonItem>
                  ))
                )}
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
        </IonSegmentView>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as SMS from 'expo-sms';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Recipient {
  name: string;
  phone: string;
  phoneType: 'mobile' | 'priority';
}

interface MessageSenderProps {
  recipients: Recipient[];
  messageTemplate: string;
}

type RecipientStatus = {
  name: string;
  phone: string;
  status: 'pending' | 'sending' | 'sent' | 'cancelled' | 'error';
};

export default function MessageSender({ recipients, messageTemplate }: MessageSenderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipientStatuses, setRecipientStatuses] = useState<RecipientStatus[]>(
    recipients.map(r => ({ name: r.name, phone: r.phone, status: 'pending' }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false); // State to track explicit cancellation

  // Effect to automatically send the next message in the queue
  useEffect(() => {
    // Check for the terminal conditions before trying to send the next message
    if (isSending && !isComplete && !isCanceled && currentIndex < recipients.length) {
      // Small timeout to allow the UI to update and provide a pause between SMS prompts
      const timer = setTimeout(() => {
        sendNextMessage();
      }, 500); 
      return () => clearTimeout(timer);
    } 
    // If we stop sending for any reason (error, cancel, end of list), 
    // but haven't marked it complete, mark it complete now.
    else if (isSending && (isCanceled || currentIndex >= recipients.length)) {
        setIsComplete(true);
        setIsSending(false);
    }
  }, [currentIndex, isSending, isComplete, isCanceled]); 

  const replaceNameInMessage = (template: string, name: string): string => {
    return template.replace(/\[name\]/gi, name);
  };

  const sendNextMessage = async () => {
    if (currentIndex >= recipients.length || isCanceled) {
      // The useEffect will handle setting isComplete/isSending
      return; 
    }

    const recipient = recipients[currentIndex];
    const personalizedMessage = replaceNameInMessage(messageTemplate, recipient.name);

    // Update status to sending
    setRecipientStatuses(prev => 
      prev.map((status, idx) => 
        idx === currentIndex ? { ...status, status: 'sending' } : status
      )
    );

    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('SMS not available on this device');
      }

      // Open SMS composer for the user to manually send/cancel
      const { result } = await SMS.sendSMSAsync(
        [recipient.phone],
        personalizedMessage
      );

      // Update status based on user action in the native app
      const newStatus = result === 'sent' ? 'sent' : 'cancelled';
      setRecipientStatuses(prev => 
        prev.map((status, idx) => 
          idx === currentIndex ? { ...status, status: newStatus } : status
        )
      );

      // Move to next recipient (this triggers the useEffect loop)
      setCurrentIndex(prev => prev + 1);
      
    } catch (error) {
      console.error('Error sending SMS:', error);
      setRecipientStatuses(prev => 
        prev.map((status, idx) => 
          idx === currentIndex ? { ...status, status: 'error' } : status
        )
      );
      // Move index forward and let useEffect handle the stop if it's the last item
      setCurrentIndex(prev => prev + 1); 
    }
  };

  const startSending = () => {
    setIsSending(true);
    setCurrentIndex(0);
    setIsCanceled(false); 
    setRecipientStatuses(recipients.map(r => ({ 
      name: r.name, 
      phone: r.phone, 
      status: 'pending' 
    })));
    setIsComplete(false);
    // Manually initiate the first send, useEffect handles the rest
    sendNextMessage();
  };

  const cancelSending = () => {
    if (!isSending) return;

    // 1. Set the cancellation flags to stop the useEffect loop
    setIsCanceled(true);

    // 2. Mark all currently 'pending' recipients as 'cancelled'
    setRecipientStatuses(prev => 
      prev.map((status, idx) => {
        // Only cancel recipients whose index is current or greater AND are pending
        if (idx >= currentIndex && status.status === 'pending') {
          return { ...status, status: 'cancelled' };
        }
        return status;
      })
    );
    // useEffect will observe isCanceled and set isComplete/isSending
  };

  const resetSending = () => {
    setCurrentIndex(0);
    setIsSending(false);
    setIsComplete(false);
    setIsCanceled(false);
    setRecipientStatuses(recipients.map(r => ({ 
      name: r.name, 
      phone: r.phone, 
      status: 'pending' 
    })));
  };

  const getStatusColor = (status: RecipientStatus['status']) => {
    switch (status) {
      case 'pending': return '#999';
      case 'sending': return '#007AFF';
      case 'sent': return '#34C759';
      case 'cancelled': return '#FF9500';
      case 'error': return '#FF3B30';
      default: return '#999';
    }
  };

  const getStatusText = (status: RecipientStatus['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'sending': return 'Sending...';
      case 'sent': return 'Sent';
      case 'cancelled': return 'Cancelled';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const sentCount = recipientStatuses.filter(s => s.status === 'sent').length;
  const cancelledCount = recipientStatuses.filter(s => s.status === 'cancelled').length;
  const errorCount = recipientStatuses.filter(s => s.status === 'error').length;
  const showResetButton = currentIndex > 0; // Show reset after the first item has been attempted

  return (
    <ThemedView style={styles.container}>
      {/* --- START/CURRENT/SUMMARY VIEW --- */}
      {!isSending && !isComplete && (
        <TouchableOpacity style={styles.startButton} onPress={startSending}>
          <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
            Start Sending Messages
          </ThemedText>
        </TouchableOpacity>
      )}

      {isSending && currentIndex < recipients.length && (
        <ThemedView style={styles.currentRecipientCard}>
          <ThemedText type="subtitle">Currently Sending To:</ThemedText>
          <ThemedText style={styles.currentName}>
            {recipients[currentIndex].name}
          </ThemedText>
          <ThemedText style={styles.currentPhone}>
            {recipients[currentIndex].phone}
          </ThemedText>
        </ThemedView>
      )}

      {isComplete && (
        <ThemedView style={styles.summaryCard}>
          <ThemedText type="title" style={styles.completeTitle}>
            {isCanceled ? 'Sending Canceled' : 'Sending Complete!'}
          </ThemedText>
          <ThemedView style={styles.summaryStats}>
            <ThemedText type="subtitle">✓ Sent: {sentCount}</ThemedText>
            {cancelledCount > 0 && (
              <ThemedText type="subtitle" style={{ color: '#FF9500' }}>
                ⊘ Cancelled: {cancelledCount}
              </ThemedText>
            )}
            {errorCount > 0 && (
              <ThemedText type="subtitle" style={{ color: '#FF3B30' }}>
                ✗ Errors: {errorCount}
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      )}

      {/* --- CANCEL BUTTON (Above Recipients Text) --- */}
      <ThemedView style={styles.listHeader}>
        <ThemedText type="subtitle" style={styles.listTitle}>
          Recipients ({recipients.length})
        </ThemedText>
        {/* The button is enabled ONLY when actively sending AND not complete/cancelled/errored out */}
        {isSending && !isCanceled && !isComplete && (
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={cancelSending}
          >
            <ThemedText type="defaultSemiBold" style={styles.cancelButtonText}>
              Cancel All Sends
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
      
      {/* --- RECIPIENTS LIST --- */}
      <ScrollView style={styles.statusList}>
          {recipientStatuses.map((recipient, index) => (
            <ThemedView key={index} style={styles.statusRow}>
              <ThemedView style={styles.statusInfo}>
                <ThemedText style={styles.statusName}>{recipient.name}</ThemedText>
                <ThemedText style={styles.statusPhone}>{recipient.phone}</ThemedText>
              </ThemedView>
              <ThemedText 
                type="defaultSemiBold"
                style={[styles.statusBadge, { color: getStatusColor(recipient.status) }]}
              >
                {getStatusText(recipient.status)}
              </ThemedText>
            </ThemedView>
          ))}
      </ScrollView>

      {/* --- BOTTOM RESET BUTTON --- */}
      {showResetButton && (
        <TouchableOpacity style={styles.bottomResetButton} onPress={resetSending}>
          <ThemedText type="defaultSemiBold" style={styles.resetButtonText}>
            Reset All
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  currentRecipientCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  currentName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  currentPhone: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  summaryCard: {
 
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#34C759',
  },
  completeTitle: {
    color: '#34C759',
    marginBottom: 16,
  },
  summaryStats: {
    marginBottom: 16,
    gap: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // Red color for cancel
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusList: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusInfo: {
    flex: 1, flexDirection: 'row'
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    width: 110,
  },
  statusPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomResetButton: {
    backgroundColor: '#FF9500', // Orange color for reset
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20, // Add space above the button
    marginBottom: 10, // Add space below
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
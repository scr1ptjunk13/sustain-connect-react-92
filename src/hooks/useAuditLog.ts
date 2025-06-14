
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
    role: string;
  };
}

export const useAuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const logAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details: Record<string, any> = {}
  ) => {
    if (!user) return;

    try {
      // Get user's IP and user agent (in a real app, this would come from server)
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      await supabase.functions.invoke('audit-log', {
        body: {
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: ip,
          user_agent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  };

  const fetchLogs = async (filters?: {
    startDate?: string;
    endDate?: string;
    action?: string;
    resourceType?: string;
  }) => {
    setLoading(true);
    try {
      const query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedLogs: AuditLogEntry[] = (data || []).map(log => ({
        ...log,
        details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details || {}
      }));
      
      setLogs(transformedLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    logAction,
    fetchLogs
  };
};

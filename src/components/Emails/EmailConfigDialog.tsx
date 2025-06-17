
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Settings, Mail, Shield } from 'lucide-react';

interface EmailConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmailConfigData {
  username: string;
  password: string;
  incomingServer: string;
  imapPort: string;
  pop3Port: string;
  outgoingServer: string;
  smtpPort: string;
  protocol: 'imap' | 'pop3';
  useSSL: boolean;
  authRequired: boolean;
  notificationEmail: string;
  notes: string;
}

export const EmailConfigDialog = ({ open, onOpenChange }: EmailConfigDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSSLConfig, setShowSSLConfig] = useState(true);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EmailConfigData>({
    defaultValues: {
      imapPort: '993',
      pop3Port: '995',
      smtpPort: '465',
      protocol: 'imap',
      useSSL: true,
      authRequired: true
    }
  });

  const useSSL = watch('useSSL');
  const protocol = watch('protocol');

  const onSubmit = async (data: EmailConfigData) => {
    setIsLoading(true);
    try {
      console.log('Saving email configuration:', data);
      // TODO: Integrate with backend when ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving email configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSLToggle = () => {
    const newSSLState = !showSSLConfig;
    setShowSSLConfig(newSSLState);
    setValue('useSSL', newSSLState);
    
    if (newSSLState) {
      setValue('imapPort', '993');
      setValue('pop3Port', '995');
      setValue('smtpPort', '465');
    } else {
      setValue('imapPort', '143');
      setValue('pop3Port', '110');
      setValue('smtpPort', '587');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações de Email
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* SSL/TLS Configuration Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                {showSSLConfig ? 'Configurações Seguras de SSL/TLS (Recomendado)' : 'Configurações sem SSL/TLS'}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome do usuário:</Label>
                <Input
                  id="username"
                  {...register('username', { required: 'Nome do usuário é obrigatório' })}
                  placeholder="Ex: adm@fullweb.com.br"
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha:</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Senha é obrigatória' })}
                  placeholder="Usar a senha da conta do e-mail"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="incomingServer">Servidor de entrada:</Label>
                <Input
                  id="incomingServer"
                  {...register('incomingServer', { required: 'Servidor de entrada é obrigatório' })}
                  placeholder="mail.fullweb.com.br"
                />
                {errors.incomingServer && (
                  <p className="text-sm text-red-600">{errors.incomingServer.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="outgoingServer">Servidor de saída:</Label>
                <Input
                  id="outgoingServer"
                  {...register('outgoingServer', { required: 'Servidor de saída é obrigatório' })}
                  placeholder="mail.fullweb.com.br"
                />
                {errors.outgoingServer && (
                  <p className="text-sm text-red-600">{errors.outgoingServer.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="imapPort">IMAP Port:</Label>
                <Input
                  id="imapPort"
                  {...register('imapPort')}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pop3Port">POP3 Port:</Label>
                <Input
                  id="pop3Port"
                  {...register('pop3Port')}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port:</Label>
                <Input
                  id="smtpPort"
                  {...register('smtpPort')}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocolo preferido:</Label>
                <Select onValueChange={(value: 'imap' | 'pop3') => setValue('protocol', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o protocolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imap">IMAP</SelectItem>
                    <SelectItem value="pop3">POP3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="authRequired" 
                    checked={true}
                    disabled
                  />
                  <label htmlFor="authRequired" className="text-sm">
                    IMAP, POP3 e SMTP require authentication
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSSLToggle}
                className="text-blue-600"
              >
                {showSSLConfig ? 'Mostrar sem configurações SSL/TLS' : 'Mostrar configurações SSL/TLS'}
              </Button>
            </div>
          </div>

          {/* Email Instructions Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Instruções de e-mail</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="notificationEmail">
                  Enviar informações de configuração para "{watch('username') || 'seu-email@exemplo.com'}" aos seguintes endereços de e-mail:
                </Label>
                <Input
                  id="notificationEmail"
                  {...register('notificationEmail')}
                  placeholder="email@exemplo.com"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações:</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  rows={6}
                  defaultValue={`O acesso de e-mail IMAP coordena entre o servidor e seu aplicativo de e-mail. As mensagens que foram lidas/excluídas/respondidas aparecerão como tal, tanto no servidor quanto no aplicativo de correio.

O POP3 não coordena com o servidor. As mensagens marcadas como lidas/excluídas/respondidas no aplicativo de e-mail não aparecerão como tal no servidor. Isso significa que futuros downloads de e-mail com POP3 mostrarão todas as mensagens como não lidas.

O e-mail de saída é enviado usando SMTP.

Recomendamos o uso de POP3 sobre SSL/TLS ou IMAP sobre SSL/TLS, pois eles fornecem maior segurança para suas interações com o servidor de e-mail remoto.`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
            >
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

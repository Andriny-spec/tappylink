'use client';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Save
} from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList>
          <TabsTrigger value="empresa">
            <Building className="w-4 h-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="pagamentos">
            <CreditCard className="w-4 h-4 mr-2" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informações da Empresa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome da Empresa
                    </label>
                    <Input placeholder="TappyID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CNPJ
                    </label>
                    <Input placeholder="00.000.000/0000-00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input placeholder="contato@tappyid.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telefone
                    </label>
                    <Input placeholder="(00) 0000-0000" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Endereço
                    </label>
                    <Input placeholder="Rua, número" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cidade
                    </label>
                    <Input placeholder="Cidade" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estado
                    </label>
                    <Input placeholder="Estado" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#17d300] hover:bg-[#15bb00]">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Métodos de Pagamento</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6" />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Aceite pagamentos via cartão</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Smartphone className="w-6 h-6" />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">Aceite pagamentos via PIX</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Planos e Preços</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Plano Premium</p>
                      <p className="text-sm text-muted-foreground">R$ 997,00/ano</p>
                    </div>
                    <Button variant="outline">Editar</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notificações por Email</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nova Venda</p>
                      <p className="text-sm text-muted-foreground">Receba notificações quando houver uma nova venda</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novo Assinante</p>
                      <p className="text-sm text-muted-foreground">Receba notificações quando um novo assinante se cadastrar</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Notificações Push</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações do Sistema</p>
                      <p className="text-sm text-muted-foreground">Receba notificações sobre atualizações do sistema</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Autenticação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Autenticação em Duas Etapas</p>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button variant="outline">Ativar</Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Senhas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Senha Atual
                    </label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nova Senha
                    </label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirmar Nova Senha
                    </label>
                    <Input type="password" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#17d300] hover:bg-[#15bb00]">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

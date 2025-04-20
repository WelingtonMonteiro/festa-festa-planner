
import { useTemplateManagement } from '@/hooks/useTemplateManagement';
import { useTemplateDialogs } from '@/hooks/useTemplateDialogs';
import TemplatesList from './templates/TemplatesList';
import CreateTemplateDialog from './templates/CreateTemplateDialog';
import DeleteTemplateDialog from './templates/DeleteTemplateDialog';
import EditTemplateDialog from './templates/EditTemplateDialog';
import VariableDialog from './templates/VariableDialog';
import TemplateListHeader from './templates/TemplateListHeader';

interface ContractTemplatesProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
  isActive?: boolean;
}

const ContractTemplates = ({ selectedTemplate, setSelectedTemplate, isActive = false }: ContractTemplatesProps) => {
  const {
    searchQuery,
    setSearchQuery,
    newTemplateName,
    setNewTemplateName,
    filteredTemplates,
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    handleSaveTemplate,
    handleAddVariable
  } = useTemplateManagement({ onTemplateSelect: setSelectedTemplate });

  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isVariableDialogOpen,
    setIsVariableDialogOpen,
    templateToEdit,
    setTemplateToEdit,
    templateToDelete,
    setTemplateToDelete,
    currentVariables,
    setCurrentVariables,
    editingVariableIndex,
    setEditingVariableIndex,
    closeEditDialog
  } = useTemplateDialogs();

  return (
    <>
      <TemplateListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      <TemplatesList
        templates={filteredTemplates}
        onEdit={handleEditTemplate}
        onCopy={handleCopyTemplate}
        onDelete={(id) => {
          setTemplateToDelete(id);
          setIsDeleteDialogOpen(true);
        }}
      />

      <CreateTemplateDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        newTemplateName={newTemplateName}
        onNameChange={setNewTemplateName}
        onCreateTemplate={handleCreateTemplate}
      />

      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteTemplate={handleDeleteTemplate}
      />

      <EditTemplateDialog
        isOpen={isEditDialogOpen}
        onOpenChange={closeEditDialog}
        template={templateToEdit}
        onSave={handleSaveTemplate}
        onEditVariables={() => setIsVariableDialogOpen(true)}
      />

      <VariableDialog
        isOpen={isVariableDialogOpen}
        onOpenChange={setIsVariableDialogOpen}
        onSubmit={handleAddVariable}
        currentVariables={currentVariables}
        editingVariable={editingVariableIndex !== null ? currentVariables[editingVariableIndex] : undefined}
        onEditVariable={(index) => {
          setEditingVariableIndex(index);
        }}
        onDeleteVariable={(index) => {
          const newVariables = currentVariables.filter((_, i) => i !== index);
          setCurrentVariables(newVariables);
          if (templateToEdit) {
            handleAddVariable(newVariables);
          }
        }}
      />
    </>
  );
};

export default ContractTemplates;


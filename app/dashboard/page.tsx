import AddNewButton from "@/features/dashboard/components/addNewButton";
import AddRepo from "@/features/dashboard/components/addRepoButton";

import ProjectTable from "@/features/dashboard/components/projectTable";
import { getAllPlaygroundForUser,duplicateProjectById,editProjectById ,deleteProjectById } from "@/features/dashboard/actions";
import EmptyState from "@/components/ui/empty-state";



// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center py-16">
//     <img src="/empty-state.svg" alt="No projects" className="w-48 h-48 mb-4" />
//     <h2 className="text-xl font-semibold text-gray-500">No projects found</h2>
//     <p className="text-gray-400">Create a new project to get started!</p>
//   </div>
// );



const DashboardMainPage = async () => {
  const playgrounds = await getAllPlaygroundForUser();



  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>


      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState title="No projects found"  description="Create a New Project to get started"  imageSrc="/empty-state.svg"/>
        ) : (
        
          <ProjectTable
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            onDuplicateProject={duplicateProjectById}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardMainPage;
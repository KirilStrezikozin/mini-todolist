import { taskListConfig } from "@/config/taskList";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeTitle } from "@/lib/features/taskList/slice";
import { TextInput } from "../text-input";

export function TaskListTitle() {
  const dispatch = useAppDispatch();
  const title = useAppSelector(state => state.taskList.title);

  return (
    <div className="flex flex-1 border-b py-2 w-full">
      <TextInput
        className="min-h-(--text-5xl) placeholder:text-4xl text-4xl file:text-4xl md:text-4xl"
        placeholder={taskListConfig.defaultTitle}
        onBlur={e => {
          /* Skip updating state in store on no changes to the title. */
          if (title !== e.target.value) {
            dispatch(changeTitle(e.target.value));
          }
        }}
        defaultValue={title}
      />
    </div>
  );
}
import MilestoneModel from './MilestoneModel';
import {ProjectOwnerModel} from './ProjectOwnerModel';

export default class ProjectModel {
  id?: number;
  title: string;
  stage: 'idea' | 'startup';
  is_visible: boolean;
  status: 'draft' | 'published';
  progress?: number;
  owner?: ProjectOwnerModel;
  milestones?: MilestoneModel[];
  registration_type?:number;
  is_registered:boolean;
  show_nda:boolean;
}

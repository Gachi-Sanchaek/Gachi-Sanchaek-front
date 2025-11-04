import Tag from './Tag';
import { useCategoryStore } from '../../../store/useCategoryStore';

const TagNames = ['산책', '동행 산책', '유기견 산책', '플로깅'];

const Category = () => {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  return (
    <div className='flex gap-3 pl-6 pt-6 fixed w-full z-20 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
      {TagNames.map((name, index) => (
        <Tag key={index} TagName={name} selected={selectedCategory === name} onClick={() => setSelectedCategory(name)} />
      ))}
    </div>
  );
};

export default Category;

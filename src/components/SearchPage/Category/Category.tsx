import Tag from './Tag';
import { CategoryStore } from '../../../store/CategoryStore';

type TagNameType = '산책' | '동행 산책' | '유기견 산책' | '플로깅';

const TagNames: TagNameType[] = ['산책', '동행 산책', '유기견 산책', '플로깅'];

const Category = () => {
  const { selectedCategory, setSelectedCategory } = CategoryStore();

  return (
    <div className='max-w-[480px] flex gap-3 pl-6 pt-6 fixed w-full z-20 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
      {TagNames.map((name, index) => (
        <Tag key={index} TagName={name} selected={selectedCategory === name} onClick={() => setSelectedCategory(name)} />
      ))}
    </div>
  );
};

export default Category;

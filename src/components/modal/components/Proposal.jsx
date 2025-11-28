

export default function Proposal({children, onClick}) {
  return (
        <button 
        type="button"
        onClick={() => onClick?.(children)}
        className="flex-1 bg-background typo-xs pt-6 px-4 pb-10 text-tertiary rounded-lg cursor-pointer">{children}
        </button>

  )
}
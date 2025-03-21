import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { SelectableUserType, UserType } from '@/lib/types/userTypes'

interface UserTypeSelectorProps {
  userType: UserType
  onUserTypeChange: (value: UserType) => void
}

export function UserTypeSelector({
  userType,
  onUserTypeChange,
}: UserTypeSelectorProps) {
  const selectableTypes = Object.values(UserType).filter(
    (type) => type !== UserType.ADMIN,
  ) as SelectableUserType[]

  return (
    <RadioGroup
      value={userType}
      onValueChange={onUserTypeChange}
      className="flex flex-col sm:flex-row gap-4 mb-4"
    >
      {Object.values(selectableTypes).map((type) => (
        <div
          key={type}
          className={`flex-1 flex items-center space-x-1 rounded-lg border p-2 cursor-pointer hover:border-black ${
            userType === type ? 'bg-black text-white' : ''
          }`}
        >
          <RadioGroupItem value={type} id={type} className="sr-only" />
          <Label
            htmlFor={type}
            className="cursor-pointer flex items-center space-x-2 flex-grow"
          >
            <div
              className={`w-3 h-3 rounded-full border ${userType === type ? 'bg-white border-white' : 'border-black'}`}
            />
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

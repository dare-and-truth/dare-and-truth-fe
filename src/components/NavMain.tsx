'use client';

import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { NotificationDropdown } from '@/components/NotificationDropdown';

export function NavMain({
  items,
}: {
  items: {
    text: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
    isButton?: boolean;
    subMenu?: {
      text: string;
      href: string;
      icon: React.ReactNode;
      active?: boolean;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.text}>
            {/* Trường hợp là button (Notification) */}
            {item.isButton ? (
              <NotificationDropdown
                icon={item.icon}
                text={item.text}
                active={item.active}
              />
            ) : !item.subMenu ? (
              /* Trường hợp không có subMenu (link điều hướng) */
              <SidebarMenuButton
                asChild
                tooltip={item.text}
                className={item.active ? 'bg-gray-200 text-base' : 'text-base'}
              >
                <Link href={item.href}>
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              /* Trường hợp có subMenu (collapsible) */
              <Collapsible
                asChild
                defaultOpen={
                  item.active || item.subMenu.some((sub) => sub.active)
                }
                className="group/collapsible"
              >
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.text}
                      className={
                        item.active ? 'bg-gray-200 text-base' : 'text-base'
                      }
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.text}</span>
                      <ChevronRight className="ml-auto h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subMenu.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.text}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              subItem.active
                                ? 'bg-gray-200 text-base'
                                : 'text-base'
                            }
                          >
                            <Link href={subItem.href}>
                              <span className="mr-2">{subItem.icon}</span>
                              <span>{subItem.text}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
